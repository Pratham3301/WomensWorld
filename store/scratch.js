const fs = require('fs');
const glob = require('glob');

glob.sync('src/app/admin/**/page.tsx').forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  if(!text.includes('force-dynamic')) {
    text = text.replace(/export default (async )?function/, 'export const dynamic = "force-dynamic";\n\nexport default $1function');
    fs.writeFileSync(f, text);
    console.log('Fixed', f);
  }
});
