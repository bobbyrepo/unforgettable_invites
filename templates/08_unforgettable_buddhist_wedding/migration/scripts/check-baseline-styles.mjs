import fs from 'fs';

const styles = JSON.parse(fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/baselines/styles-1440.json', 'utf8'));

const nameStyles = styles.filter(s => {
  const t = s.text || '';
  const sel = s.selector || '';
  return sel.includes('Hero Title') || sel.includes('Groom Name') || sel.includes('Bride Name') || t.includes('Maya') || t.includes('Siddharth');
});

console.log('Baseline styles count:', nameStyles.length);
nameStyles.forEach(s => {
  console.log({
    selector: s.selector,
    fontFamily: s.fontFamily,
    fontWeight: s.fontWeight,
    fontSize: s.fontSize,
    text: s.text
  });
});
