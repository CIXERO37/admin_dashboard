const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app', '(dashboard)');
const folders = fs.readdirSync(appDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

let mdContent = `# Admin Dashboard Project Analysis\n\n`;
mdContent += `## 1. Folder Structure & Role\n\n`;
mdContent += `The \`app/(dashboard)\` directory contains the main application pages, structured by feature. Each folder represents a distinct feature/route group.\n\n`;

folders.forEach(folder => {
    mdContent += `- **${folder}**: Handles features related to ${folder.replace(/-/g, ' ')}.\n`;
});

mdContent += `\n## 2. Pages, Features, and Supabase Connections\n\n`;

folders.forEach(folder => {
    const folderPath = path.join(appDir, folder);
    mdContent += `### ${folder.toUpperCase()}\n\n`;
    
    // Find files
    const getFiles = (dir, ext) => {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            file = path.resolve(dir, file);
            const stat = fs.statSync(file);
            if (stat && stat.isDirectory()) { 
                results = results.concat(getFiles(file, ext));
            } else { 
                if(file.endsWith(ext) || file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
            }
        });
        return results;
    }
    
    let files = [];
    try {
        files = getFiles(folderPath, '.ts');
    } catch(e) {}

    mdContent += `**Files connected/used:**\n`;
    files.forEach(f => {
        mdContent += `- \`${path.relative(__dirname, f)}\`\n`;
    });
    mdContent += `\n`;

    // Search for supabase interactions
    let tables = new Set();
    let columns = new Set();
    
    files.forEach(f => {
        const content = fs.readFileSync(f, 'utf-8');
        const fromRegex = /\.from\(['"]([^'"]+)['"]\)/g;
        let match;
        while ((match = fromRegex.exec(content)) !== null) {
            tables.add(match[1]);
        }
        
        const selectRegex = /\.select\(['"]([^'"]+)['"]\)/g;
        while ((match = selectRegex.exec(content)) !== null) {
            columns.add(match[1]);
        }
    });

    if(tables.size > 0) {
        mdContent += `**Supabase Connections:**\n`;
        mdContent += `- **Tables:** ${Array.from(tables).join(', ')}\n`;
        if(columns.size > 0) {
            mdContent += `- **Columns Selected/Manipulated:** ${Array.from(columns).join(', ')}\n`;
        }
        
        mdContent += `\n**Illustration (DB Connection):**\n`;
        mdContent += `\`\`\`mermaid\n`;
        mdContent += `graph TD;\n`;
        mdContent += `    Page["${folder} Pages/Actions"] --> Supabase[(Supabase)];\n`;
        Array.from(tables).forEach(t => {
            mdContent += `    Supabase --> Table_${t.replace(/[^a-zA-Z0-9]/g, '')}["Table: ${t}"];\n`;
        });
        mdContent += `\`\`\`\n\n`;
    } else {
        mdContent += `*No direct Supabase \`.from()\` usage detected in this directory. It might rely on APIs, context, or hooks from other directories.*\n\n`;
    }
    
    mdContent += `---\n\n`;
});

fs.writeFileSync('Project_Analysis.md', mdContent);
console.log('Project_Analysis.md generated successfully.');
