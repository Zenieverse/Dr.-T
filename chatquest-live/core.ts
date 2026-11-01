import { randomUUID } from 'node:crypto';

export type QuestStatus = 'draft'|'active'|'paused'|'ended';
export type QuestMode = 'vote'|'story'|'mystery'|'creative'|'teams';
export interface QuestOption { id:string; label:string; votes:number; }
export interface Contribution { id:string; user:string; text:string; status:'pending'|'approved'|'rejected'; createdAt:string; kind:'suggestion'|'story'|'clue'; }
export interface Quest {
 id:string; title:string; description:string; rules:string; durationMinutes:number; mode:QuestMode; status:QuestStatus;
 options:QuestOption[]; participants:string[]; votes:Record<string,string>; contributions:Contribution[];
 createdAt:string; endsAt?:string; pausedRemainingMs?:number; communityScore:number;
 scores:Record<string,number>; teams:Record<string,'Ember'|'Tide'>;
}
export interface ChatCommand {command:string;argument:string;}
export function parseChatCommand(raw:string):ChatCommand|null {
 const text=String(raw||'').trim(); if(!text.startsWith('!'))return null;
 const [command,...rest]=text.slice(1).split(/\s+/);
 return command?{command:command.toLowerCase(),argument:rest.join(' ').slice(0,280)}:null;
}
export function validateQuest(input:Partial<Quest>):string|null {
 if(typeof input.title!=='string'||!input.title.trim()||input.title.trim().length>80)return 'Quest title must contain 1–80 characters.';
 if(typeof input.description!=='string'||!input.description.trim()||input.description.trim().length>500)return 'Description must contain 1–500 characters.';
 if(typeof input.rules!=='string'||!input.rules.trim()||input.rules.trim().length>500)return 'Rules must contain 1–500 characters.';
 if(!Number.isInteger(input.durationMinutes)||Number(input.durationMinutes)<1||Number(input.durationMinutes)>180)return 'Duration must be between 1 and 180 minutes.';
 if(!['vote','story','mystery','creative','teams'].includes(String(input.mode)))return 'Choose a supported quest mode.';
 if(input.mode==='vote') {
  if(!Array.isArray(input.options)||input.options.length<2||input.options.length>6)return 'Voting quests need 2–6 options.';
  const labels=input.options.map(o=>String(o?.label||'').trim().toLowerCase());
  if(labels.some(x=>!x)||new Set(labels).size!==labels.length)return 'Voting options must be named and unique.';
 }
 return null;
}
function safeUser(username:string){return String(username||'').replace(/[^a-zA-Z0-9_]/g,'').slice(0,25);}
function cleanContribution(value:string){return String(value||'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,280);}
export function applyChatAction(quest:Quest,username:string,command:ChatCommand,now=new Date()):{quest:Quest;reply:string}{
 const user=safeUser(username); if(!user)return{quest,reply:'Please use a valid Twitch username.'};
 if(quest.status!=='active')return{quest,reply:'There is no active quest right now.'};
 const next=structuredClone(quest);
 if(command.command==='quest')return{quest,reply:'Quest: '+next.title+' — '+next.description+' Rules: '+next.rules};
 if(command.command==='help')return{quest,reply:'Commands: !quest, !join, !vote A, !suggest idea, !score, !help'};
 if(command.command==='join'){
  if(next.participants.includes(user))return{quest,reply:'@'+user+' you are already in this quest.'};
  next.participants.push(user);next.communityScore++;next.scores[user]=(next.scores[user]||0)+1;
  if(next.mode==='teams'){const ember=Object.values(next.teams).filter(t=>t==='Ember').length;const tide=Object.values(next.teams).filter(t=>t==='Tide').length;const team=ember<=tide?'Ember':'Tide';next.teams[user]=team;return{quest:next,reply:'@'+user+' joined Team '+team+'! +1 community point.'};}
  return{quest:next,reply:'@'+user+' joined the quest! +1 community point.'};
 }
 if(command.command==='score')return{quest,reply:'@'+user+' community score: '+(next.scores[user]||0)+' point(s).'+(next.teams[user]?' Team '+next.teams[user]+'.':'')};
 if(command.command==='vote'){
  if(next.mode!=='vote')return{quest,reply:'This quest is not in voting mode.'};
  const option=next.options.find(o=>o.id.toLowerCase()===command.argument.toLowerCase()||o.label.toLowerCase()===command.argument.toLowerCase());
  if(!option)return{quest,reply:'Choose one of: '+next.options.map(o=>o.id).join(', ')};
  const previous=next.votes[user];if(previous===option.id)return{quest,reply:'@'+user+' your vote is already counted.'};
  if(previous){const old=next.options.find(o=>o.id===previous);if(old)old.votes=Math.max(0,old.votes-1);}
  next.votes[user]=option.id;option.votes++;
  if(!previous){next.communityScore++;next.scores[user]=(next.scores[user]||0)+1;}
  return{quest:next,reply:'@'+user+' voted for '+option.id+'.'};
 }
 if(['suggest','story','clue'].includes(command.command)){
  const text=cleanContribution(command.argument);if(!text)return{quest,reply:'Add your idea after !'+command.command+'.'};
  if(next.contributions.filter(c=>c.user===user&&c.status==='pending').length>=3)return{quest,reply:'@'+user+' you have reached the three pending-submission limit.'};
  if(next.contributions.some(c=>c.user===user&&c.status==='pending'&&c.text.toLowerCase()===text.toLowerCase()))return{quest,reply:'That contribution is already awaiting review.'};
  if(command.command==='story'&&next.mode!=='story')return{quest,reply:'This quest is not a storytelling quest.'};
  if(command.command==='clue'&&next.mode!=='mystery')return{quest,reply:'This quest is not a mystery quest.'};
  const kind=command.command==='story'?'story':command.command==='clue'?'clue':'suggestion';
  next.contributions.push({id:randomUUID(),user,text,status:'pending',createdAt:now.toISOString(),kind});
  next.communityScore++;next.scores[user]=(next.scores[user]||0)+1;
  return{quest:next,reply:'Thanks @'+user+'! Your '+kind+' is awaiting host approval.'};
 }
 return{quest,reply:'Unknown command. Type !help for the list.'};
}
export function tallyQuest(quest:Quest){
 const totalVotes=quest.options.reduce((sum,o)=>sum+o.votes,0),max=Math.max(0,...quest.options.map(o=>o.votes));
 const leaders=quest.options.filter(o=>o.votes===max&&max>0);
 return{totalVotes,winner:leaders.length===1?leaders[0]:null,participation:quest.participants.length+totalVotes+quest.contributions.filter(c=>c.status==='approved').length,teamScores:{Ember:Object.values(quest.teams).filter(t=>t==='Ember').length,Tide:Object.values(quest.teams).filter(t=>t==='Tide').length}};
}
