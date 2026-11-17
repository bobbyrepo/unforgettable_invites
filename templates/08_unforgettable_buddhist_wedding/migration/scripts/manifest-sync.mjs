import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';

// The verified target sync paths from D5 / sync script
const TARGET_DIRS = [
    'E:/Unforgettable_Invites/Web_Templates/public/templates/08_unforgettable_buddhist_wedding',
    'E:/Unforgettable_Invites/Template Backup/08_unforgettable_buddhist_wedding',
    'E:/Unforgettable_Invites/09_unforgettable_buddha_react/public/templates/08_unforgettable_buddhist_wedding',
    'E:/Unforgettable_Invites/09_unforgettable_buddha_react/public'
];

// Files modified/created in Track 1 to Track 5 to sync
const MANIFEST_FILES = [
    'css/main.css',
    'css/layout.css',
    'css/theme.css',
    'css/audio.css',
    'css/extracted.css',
    'scripts/parallax.js',
    'index.html'
];

console.log('[manifest-sync] Starting sync across verified targets...');

TARGET_DIRS.forEach(targetDir => {
    if (!fs.existsSync(targetDir)) {
        console.log(`[manifest-sync] Target directory does not exist, creating: ${targetDir}`);
        fs.mkdirSync(targetDir, { recursive: true });
    }

    MANIFEST_FILES.forEach(relFile => {
        const srcFile = path.join(SRC_DIR, relFile);
        const destFile = path.join(targetDir, relFile);

        if (fs.existsSync(srcFile)) {
            fs.mkdirSync(path.dirname(destFile), { recursive: true });
            fs.copyFileSync(srcFile, destFile);
            console.log(`  Synced: ${relFile} -> ${destFile}`);
        }
    });
});

console.log('✅ [manifest-sync] All targets successfully synchronized!');
