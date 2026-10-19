export function isSignedIn(req:Request){return !!req.headers.get('oai-authenticated-user-id');}
export function workspace(req:Request){const id=req.headers.get('oai-authenticated-user-id');if(!id)throw Error('Sign in to access your workspace.');return 'users/'+encodeURIComponent(id);}
export function displayName(req:Request){const value=req.headers.get('oai-authenticated-user-full-name');if(value){try{return req.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8'?decodeURIComponent(value):value}catch{}}return req.headers.get('oai-authenticated-user-email')?.split('@')[0]||'Your workspace';}

export function assertSameOrigin(req:Request){const origin=req.headers.get('origin');if(origin&&new URL(origin).origin!==new URL(req.url).origin)throw Error('Invalid origin');}
