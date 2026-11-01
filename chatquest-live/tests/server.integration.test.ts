import { strict as assert } from 'node:assert';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';

const originalFetch=globalThis.fetch;
const dataFile=path.join('/tmp','chatquest-live-'+randomUUID()+'.json');
process.env.CHATQUEST_DATA_FILE=dataFile;
process.env.CHATQUEST_SESSION_SECRET='test-only-session-secret-which-is-long-enough-32-bytes';
process.env.TWITCH_CLIENT_ID='test-client-id';
process.env.TWITCH_CLIENT_SECRET='test-client-secret';
process.env.TWITCH_REDIRECT_URI='http://127.0.0.1:0/api/chatquest/auth/callback';

class FakeWebSocket {
 static instances:FakeWebSocket[]=[];
 onmessage:((event:{data:string})=>void)|null=null;
 onclose:(()=>void)|null=null;
 onerror:(()=>void)|null=null;
 url:string;
 constructor(url:string){this.url=url;FakeWebSocket.instances.push(this);}
 message(value:unknown){this.onmessage?.({data:JSON.stringify(value)});}
}
(globalThis as any).WebSocket=FakeWebSocket;
const calls:{url:string;init:RequestInit}[]=[];
globalThis.fetch=(async(input:any,init:RequestInit={})=>{
 const url=String(input);calls.push({url,init});
 if(url==='https://id.twitch.tv/oauth2/token'){
  const body=String(init.body||'');
  if(body.includes('authorization_code'))return new Response(JSON.stringify({access_token:'fake-access',refresh_token:'fake-refresh',expires_in:3600,scope:['user:read:chat','user:write:chat']}),{status:200,headers:{'content-type':'application/json'}});
  return new Response(JSON.stringify({access_token:'fake-access-2',refresh_token:'fake-refresh-2',expires_in:3600}),{status:200,headers:{'content-type':'application/json'}});
 }
 if(url==='https://api.twitch.tv/helix/users')return new Response(JSON.stringify({data:[{id:'broadcaster-1',login:'teststreamer',display_name:'TestStreamer'}]}),{status:200,headers:{'content-type':'application/json'}});
 if(url==='https://api.twitch.tv/helix/eventsub/subscriptions')return new Response(JSON.stringify({data:[{id:'sub-1'}]}),{status:202,headers:{'content-type':'application/json'}});
 if(url==='https://api.twitch.tv/helix/chat/messages')return new Response(JSON.stringify({data:[{is_sent:true}]}),{status:200,headers:{'content-type':'application/json'}});
 return originalFetch(input,init);
}) as typeof fetch;

const {registerChatQuestRoutes}=await import('../server');
const app=express();app.use(express.json());registerChatQuestRoutes(app);
const server=createServer(app);
await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=server.address();assert(address&&typeof address==='object');
const base='http://127.0.0.1:'+address.port;
process.env.TWITCH_REDIRECT_URI=base+'/api/chatquest/auth/callback';
async function request(url:string,init:RequestInit={}){return originalFetch(base+url,{...init,headers:{...(init.headers||{})}});}
try{
 const unauth=await request('/api/chatquest/quests',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({})});
 assert.equal(unauth.status,401,'mutations must require a streamer session');

 const start=await request('/api/chatquest/auth/twitch');assert.equal(start.status,302);
 const authUrl=new URL(start.headers.get('location')!);const state=authUrl.searchParams.get('state')!;
 const stateCookie=(start.headers.get('set-cookie')||'').split(';')[0];
 assert(authUrl.searchParams.get('scope')?.includes('user:read:chat'));
 assert(authUrl.searchParams.get('scope')?.includes('user:write:chat'));
 const badState=await request('/api/chatquest/auth/callback?code=bad&state='+state);
 assert.equal(badState.status,400,'OAuth state must be bound to the initiating browser');
 const start2=await request('/api/chatquest/auth/twitch');
 const authUrl2=new URL(start2.headers.get('location')!);const state2=authUrl2.searchParams.get('state')!;
 const stateCookie2=(start2.headers.get('set-cookie')||'').split(';')[0];
 const callback=await request('/api/chatquest/auth/callback?code=fake-code&state='+state2,{headers:{cookie:stateCookie2}});
 assert.equal(callback.status,302,'OAuth callback should establish a session');
 const sessionCookie=(callback.headers.get('set-cookie')||'').split(',').map(x=>x.trim()).find(x=>x.startsWith('cq_session='))?.split(';')[0];
 assert(sessionCookie,'OAuth callback must set a session cookie');
 const ws=FakeWebSocket.instances.at(-1)!;assert(ws,'OAuth should open EventSub WebSocket');
 ws.message({metadata:{message_type:'session_welcome'},payload:{session:{id:'eventsub-session-1'}}});
 await new Promise(r=>setTimeout(r,20));
 assert(calls.some(c=>c.url==='https://api.twitch.tv/helix/eventsub/subscriptions'),'EventSub subscription must be requested');

 const create=await request('/api/chatquest/quests',{method:'POST',headers:{cookie:sessionCookie,'content-type':'application/json'},body:JSON.stringify({title:'Community Compass',description:'Choose a path',rules:'Be kind',durationMinutes:10,mode:'vote',options:[{label:'Forest'},{label:'Moon'}]})});
 assert.equal(create.status,201);const created=await create.json() as any;const questId=created.quest.id;
 const startQuest=await request('/api/chatquest/quests/'+questId+'/action',{method:'POST',headers:{cookie:sessionCookie,'content-type':'application/json'},body:JSON.stringify({action:'start'})});
 assert.equal(startQuest.status,200);

 const event=(messageId:string,text:string)=>ws.message({metadata:{message_type:'notification',message_id:messageId},payload:{subscription:{type:'channel.chat.message'},event:{chatter_user_id:'viewer-1',chatter_user_login:'viewerone',message:{text}}}});
 event('evt-join','!join');await new Promise(r=>setTimeout(r,30));
 event('evt-suggest','!suggest A friendly dragon');await new Promise(r=>setTimeout(r,30));
 event('evt-vote','!vote A');await new Promise(r=>setTimeout(r,30));
 assert(calls.some(c=>c.url==='https://api.twitch.tv/helix/chat/messages'),'chat commands should generate Twitch replies');

 const privateList=await request('/api/chatquest/quests',{headers:{cookie:sessionCookie}});const list=await privateList.json() as any;
 const q=list.quests.find((x:any)=>x.id===questId);assert.equal(q.participants.length,1);assert.equal(q.options[0].votes,1);
 const overlay=await request('/api/chatquest/overlay');const publicSnapshot=await overlay.json() as any;
 assert.equal(publicSnapshot.quest.participantCount,1);assert.equal(publicSnapshot.quest.votes,undefined,'public overlay must not expose viewer vote identities');
 assert.equal(publicSnapshot.quest.contributions.length,0,'pending submissions must not leak to overlay');

 const contribution=q.contributions[0];
 const approve=await request('/api/chatquest/quests/'+questId+'/contributions/'+contribution.id+'/moderate',{method:'POST',headers:{cookie:sessionCookie,'content-type':'application/json'},body:JSON.stringify({status:'approved'})});
 assert.equal(approve.status,200);
 const approvedOverlay=await (await request('/api/chatquest/overlay')).json() as any;
 assert.equal(approvedOverlay.quest.contributions.length,1,'only host-approved submissions appear publicly');

 const end=await request('/api/chatquest/quests/'+questId+'/action',{method:'POST',headers:{cookie:sessionCookie,'content-type':'application/json'},body:JSON.stringify({action:'end'})});
 assert.equal(end.status,200);
 assert(fs.existsSync(dataFile),'quest data should be persisted');
 const persisted=JSON.parse(fs.readFileSync(dataFile,'utf8'));assert(persisted.quests.some((x:any)=>x.id===questId));
 console.log('ChatQuest server integration tests passed: auth state, token exchange, EventSub subscribe, host authorization, quest lifecycle, live chat commands, Helix replies, overlay privacy, moderation and persistence.');
}finally{
 await new Promise<void>(resolve=>server.close(()=>resolve()));
 globalThis.fetch=originalFetch;
 try{fs.unlinkSync(dataFile);}catch{}
}
