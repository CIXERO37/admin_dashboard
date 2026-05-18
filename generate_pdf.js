const fs = require('fs');
const PDFDocument = require('pdfkit');

const mdContent = fs.readFileSync('Project_Analysis.md', 'utf-8');

// A very simple markdown to PDF text parser
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('Project_Analysis.pdf'));

doc.fontSize(20).text('Admin Dashboard Project Analysis', { align: 'center' });
doc.moveDown();

const lines = mdContent.split('\n');

for (let line of lines) {
    if (line.startsWith('```mermaid') || line.startsWith('graph TD;') || line.includes('Page[') || line.includes('Supabase[') || line.includes('Supabase -->') || line.startsWith('```')) {
        continue; // Skip mermaid raw syntax and markdown codeblocks
    }

    if (line.startsWith('# ')) {
        doc.fontSize(18).font('Helvetica-Bold').text(line.replace('# ', ''));
        doc.moveDown();
    } else if (line.startsWith('## ')) {
        doc.fontSize(16).font('Helvetica-Bold').text(line.replace('## ', ''));
        doc.moveDown();
    } else if (line.startsWith('### ')) {
        doc.fontSize(14).font('Helvetica-Bold').text(line.replace('### ', ''));
        doc.moveDown();
    } else if (line.startsWith('**')) {
        doc.fontSize(12).font('Helvetica-Bold').text(line.replace(/\*\*/g, ''));
    } else if (line.startsWith('- ')) {
        doc.fontSize(12).font('Helvetica').text('  ' + line);
    } else if (line.trim().length > 0) {
        doc.fontSize(12).font('Helvetica').text(line.replace(/\*/g, ''));
        doc.moveDown();
    } else {
        doc.moveDown(0.5);
    }
}

doc.end();
console.log('PDF generated manually.');
