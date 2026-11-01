export type QuestStatus = 'draft' | 'active' | 'paused' | 'ended';
export interface QuestOption { id:string; label:string; votes:number; }
export interface Contribution { id:string; user:string; text:string; status:'pending'|'approved'|'rejected'; createdAt:string; }
export interface Quest { id:string; title:string; description:string; rules:string; durationMinutes:number; mode:'vote'|'story'|'mystery'|'creative'|'teams'; status:QuestStatus; options:QuestOption[]; participants:string[]; votes:Record<string,string>; contributions:Contribution[]; createdAt:string; endsAt?:string; communityScore:number; }
export interface ChatCommand { command:string; argument:string; }
export function parseChatCommand(raw:string):ChatCommand|null { const text=String(raw||'').trim(); if(!text.startsWith('!'))return null; const [command,...rest]=text.slice(1).split(/\s+/); return command?{command:command.toLowerCase(),argument:rest.join(' ').slice(0,280)}:null; }
export function validateQuest(input:Partial<Quest>):string|null {
 if(!input.title?.trim()||input.title.trim().length>80)return 'Quest title must contain 1–80 characters.';
 if(!input.description?.trim()||input.description.trim().length>500)return 'Description must contain 1–500 characters.';
 if(!input.rules?.trim()||input.rules.trim().length>500)return 'Rules must contain 1–500 characters.';
 if(!Number.isInteger(input.durationMinutes)||Number(input.durationMinutes)<1||Number(input.durationMinutes)>180)return 'Duration must be between 1 and 180 minutes.';
 if(!['vote','story','mystery','creative','teams'].includes(String(input.mode)))return 'Choose a supported quest mode.';
 if(input.mode==='vote'&&(!Array.isArray(input.options)||input.options.length<2||input.options.length>6||input.options.some(o=>!o.label?.trim())))return 'Voting quests need 2–6 named options.';
 return null;
}
function id():string{return Math.random().toString(36).slice(2,10)+Date.now().toString(36);}
export function applyChatAction(quest:Quest,username:string,command:ChatCommand,now=new Date()):{quest:Quest;reply:string}{
 const user=username.replace(/[^a-zA-Z0-9_]/g,'').slice(0,25); if(!user)return{quest,reply:'Please use a valid Twitch username.'};
 if(quest.status!=='active')return{quest,reply:'There is no active quest right now.'};
 const next=structuredClone(quest);
 if(command.command==='quest')return{quest,reply:'Quest: '+next.title+' — '+next.description};
 if(command.command==='help')return{quest,reply:'Commands: !quest, !join, !vote A, !suggest your idea, !score, !help'};
 if(command.command==='join'){if(next.participants.includes(user))return{quest,reply:'@'+user+' you are already in this quest.'};next.participants.push(user);next.communityScore++;return{quest:next,reply:'@'+user+' joined the quest! +1 community point.'};}
 if(command.command==='score')return{quest,reply:'@'+user+' community score: '+(next.participants.includes(user)?1:0)+' point(s).'};
 if(command.command==='vote'){if(next.mode!=='vote')return{quest,reply:'This quest is not in voting mode.'};const option=next.options.find(o=>o.id.toLowerCase()===command.argument.toLowerCase()||o.label.toLowerCase()===command.argument.toLowerCase());if(!option)return{quest,reply:'Choose one of: '+next.options.map(o=>o.id).join(', ')};const previous=next.votes[user];if(previous===option.id)return{quest,reply:'@'+user+' your vote is already counted.'};if(previous){const old=next.options.find(o=>o.id===previous);if(old)old.votes=Math.max(0,old.votes-1);}next.votes[user]=option.id;option.votes++;if(!previous)next.communityScore++;return{quest:next,reply:'@'+user+' voted for '+option.id+'.'};}
 if(command.command==='suggest'){if(!command.argument.trim())return{quest,reply:'Add an idea after !suggest.'};if(next.contributions.some(c=>c.user===user&&c.status==='pending'&&c.text===command.argument))return{quest,reply:'That suggestion is already awaiting review.'};next.contributions.push({id:id(),user,text:command.argument.slice(0,280),status:'pending',createdAt:now.toISOString()});next.communityScore++;return{quest:next,reply:'Thanks @'+user+'! Your idea is awaiting the host.'};}
 return{quest,reply:'Unknown command. Type !help for the list.'};
}
export function tallyQuest(quest:Quest){const totalVotes=quest.options.reduce((sum,o)=>sum+o.votes,0);const max=Math.max(0,...quest.options.map(o=>o.votes));const leaders=quest.options.filter(o=>o.votes===max&&max>0);return{totalVotes,winner:leaders.length===1?leaders[0]:null,participation:quest.participants.length+totalVotes+quest.contributions.length};}
