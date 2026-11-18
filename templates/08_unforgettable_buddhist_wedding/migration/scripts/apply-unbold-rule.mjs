import fs from 'fs';

const themeCssPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/css/theme.css';
let content = fs.readFileSync(themeCssPath, 'utf8');

const newRule = `
/* === Bride & Groom Names: Ensure Original Regular Font (Never Bold) === */
[data-framer-name*="Hero Title — Maya"] p,
[data-framer-name*="Hero Title — Siddharth"] p,
[data-framer-name*="Bride Name"] p,
[data-framer-name*="Groom Name"] p,
.tp-miofarin-86-18,
.tp-miofarin-65-19,
.tp-miofarin-75-31,
.tp-miofarin-67-32,
.tp-miofarin-140-61,
.tp-miofarin-171-62,
.tp-miofarin-129-68,
.tp-miofarin-151-70 {
    font-family: "Miofarin Regular", sans-serif !important;
    font-weight: 400 !important;
    font-synthesis: none !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    letter-spacing: normal !important;
}
`;

if (!content.includes('Ensure Original Regular Font')) {
  content += newRule;
  fs.writeFileSync(themeCssPath, content, 'utf8');
  console.log('Appended regular font rule to theme.css');
} else {
  console.log('Rule already exists in theme.css');
}
