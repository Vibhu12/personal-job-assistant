import fs from 'node:fs';
const projectId=process.argv[2];
if(!projectId||!projectId.startsWith('appgprj_'))throw Error('Provide the exact project ID returned by Sites registration.');
const path=new URL('../.openai/hosting.json',import.meta.url);const manifest=JSON.parse(fs.readFileSync(path,'utf8'));manifest.project_id=projectId;fs.writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');console.log('Project identity configured. No deployment performed.');
