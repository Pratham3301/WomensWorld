const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
}

const files = walkSync('src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));

const emojis = ['✨', '🛍️', '👗', '🏛️', '🌟', '⚠️', '🖼️', '🍱', '🏷️', '✦'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/font-poppins/g, 'font-playfair')
    .replace(/font-nunito/g, 'font-inter');

  emojis.forEach(e => {
    newContent = newContent.split(e).join('');
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
console.log('Done typography and emoji purge.');
