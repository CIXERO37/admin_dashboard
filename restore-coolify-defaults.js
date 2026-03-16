const fs = require('fs');
const path = require('path');

console.log('Restoring default configuration...');

// 1. Remove Dockerfile
try {
    const dockerPath = path.join(__dirname, 'Dockerfile');
    if (fs.existsSync(dockerPath)) {
        fs.unlinkSync(dockerPath);
        console.log('✅ Dockerfile removed');
    }
} catch (e) {
    console.error('❌ Failed to remove Dockerfile', e.message);
}

// 2. Revert next.config.mjs
try {
    const configPath = path.join(__dirname, 'next.config.mjs');
    if (fs.existsSync(configPath)) {
        let config = fs.readFileSync(configPath, 'utf8');
        // Remove the output: "standalone" line
        if (config.includes('output: "standalone"')) {
            config = config.replace(/\s*output: "standalone",?/, '');
            fs.writeFileSync(configPath, config);
            console.log('✅ next.config.mjs reverted');
        }
    }
} catch (e) {
    console.error('❌ Failed to revert next.config.mjs', e.message);
}

// 3. Revert .gitignore
try {
    const gitignorePath = path.join(__dirname, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        let gitignore = fs.readFileSync(gitignorePath, 'utf8');
        
        // The block we added
        const targetBlock = `# .next logic for Standalone Build
/.next/
# Whitelist standalone and static folders so they CAN be uploaded
!/.next/standalone/
!/.next/static/`;

        // Check if our specific block exists
        if (gitignore.includes('!/.next/standalone/')) {
            // Replace the whole custom block with the standard single line
            // We use replace with string to be safe, but fallback to manual replacement if string doesn't match perfectly due to whitespace
            if (gitignore.includes(targetBlock)) {
                gitignore = gitignore.replace(targetBlock, '/.next/');
            } else {
                // Formatting fallback: Replace the whitelist lines and the comment
                gitignore = gitignore.replace('# .next logic for Standalone Build\r\n', '')
                                     .replace('# .next logic for Standalone Build\n', '')
                                     .replace('!/.next/standalone/\r\n', '')
                                     .replace('!/.next/standalone/\n', '')
                                     .replace('!/.next/static/\r\n', '')
                                     .replace('!/.next/static/\n', '')
                                     .replace('# Whitelist standalone and static folders so they CAN be uploaded\r\n', '')
                                     .replace('# Whitelist standalone and static folders so they CAN be uploaded\n', '');
            }
            
            fs.writeFileSync(gitignorePath, gitignore);
            console.log('✅ .gitignore reverted');
        }
    }
} catch (e) {
    console.error('❌ Failed to revert .gitignore', e.message);
}

console.log('\nRestore complete.');
console.log('IMPORTANT: Run "git rm -r --cached .next" in your terminal to stop tracking build files.');
