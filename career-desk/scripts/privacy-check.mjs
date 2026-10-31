import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const skip=new Set(['node_modules','.git','dist','.next','.vinext','.wrangler','outputs','coverage','.sites-runtime']);
const checks=[
 ['private-key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
 ['github-token',/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/],
 ['aws-access-key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
 ['personal-email',/[A-Z0-9._%+-]+@(?:gmail|yahoo|outlook|hotmail)\.[A-Z]{2,}/i],
 ['deployment-identity',/\b(?:appgprj|appgdep|appgver|libfile)_[a-z0-9]{16,}\b/i]
];
let files=0,findings=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(skip.has(entry.name)||entry.isSymbolicLink())continue;
 const file=path.join(dir,entry.name),relative=path.relative(root,file);
 if(entry.isDirectory()){walk(file);continue;}
 files++;
 if(/\.(?:pdf|docx|xlsx|csv|zip|pem|key|log|tsbuildinfo)$/i.test(entry.name))findings.push({path:relative,category:'excluded-data-file'});
 const text=fs.readFileSync(file,'utf8');
 for(const [category,pattern]of checks)if(pattern.test(text))findings.push({path:relative,category});
}}
walk(root);console.log(JSON.stringify({files,findings},null,2));if(findings.length)process.exitCode=1;
