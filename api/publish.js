// OPTIONAL server-side GitHub publishing scaffold. Do not deploy as-is without production auth.
// Required env: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH. Add real auth, CSRF/origin controls, rate limits, and audit logs first.
const allowed=new Set(['content/site.json','content/services.json','content/experience.json','content/education.json','content/skills.json','content/process.json','content/projects.json','content/why-work-with-me.json']);
export default async function handler(req,res){if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});return res.status(501).json({error:'Publishing intentionally disabled in this starter. Use manual JSON export until a production authentication layer is implemented.',allowedPaths:[...allowed]});}
