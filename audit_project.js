const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, 'docs');
const CONFIG_PATH = path.resolve(DOCS_DIR, '.vuepress/config.js');
const REPORT_PATH = path.resolve(__dirname, 'audit_report.md');

let reportContent = '# Project Vulnerability Report\n\n| File Path | Line | Issue Type | Description | Fix Suggestion |\n| --- | --- | --- | --- | --- |\n';
let hasErrors = false;

function logIssue(filePath, line, type, description, fix) {
    const relativePath = path.relative(__dirname, filePath);
    reportContent += `| ${relativePath} | ${line} | ${type} | ${description} | ${fix} |\n`;
    hasErrors = true;
    console.log(`[${type}] ${relativePath}:${line} - ${description}`);
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if (file !== 'node_modules' && file !== '.vuepress' && file !== '.git') {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
        } else {
            if (file.endsWith('.md')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

function checkMarkdownFiles() {
    const files = getAllFiles(DOCS_DIR);
    
    for (const absolutePath of files) {
        const content = fs.readFileSync(absolutePath, 'utf-8');
        const lines = content.split('\n');
        
        let inCodeBlock = false;
        let lastHeaderLevel = 0;
        
        // 1. Check Header Hierarchy & Code Blocks
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            
            // Code block check
            if (line.trim().startsWith('```')) {
                inCodeBlock = !inCodeBlock;
            }
            
            if (inCodeBlock) return; // Skip checks inside code blocks

            // Header check
            const headerMatch = line.match(/^(#+)\s+(.*)/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                if (level > lastHeaderLevel + 1 && lastHeaderLevel !== 0) {
                    logIssue(absolutePath, lineNum, 'Format', `Header level jump from h${lastHeaderLevel} to h${level}`, `Adjust header level to h${lastHeaderLevel + 1}`);
                }
                lastHeaderLevel = level;
            }
        });

        if (inCodeBlock) {
             logIssue(absolutePath, lines.length, 'Syntax', 'Unclosed code block', 'Add closing ```');
        }

        // 2. Check Links and Images
        // Regex for [text](link) and ![alt](link)
        // Improved regex to handle newlines inside [] or () which is valid md but rare, simple regex usually fine
        const linkRegex = /(!?)\[([^\]]*)\]\(([^)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
            const isImage = match[1] === '!';
            const text = match[2];
            let link = match[3].split(' ')[0]; // remove title part if any
            
            // Ignore external links for existence check (for now)
            if (link.startsWith('http')) {
                continue;
            }
            
            // Ignore anchors for now
            if (link.startsWith('#')) {
                continue;
            }

            // Resolve local link
            let targetPath;
            if (link.startsWith('/')) {
                // Absolute path relative to docs/ (VuePress convention)
                targetPath = path.join(DOCS_DIR, link);
            } else {
                // Relative path
                targetPath = path.resolve(path.dirname(absolutePath), link);
            }
            
            // Remove anchor from target path
            let anchor;
            if (targetPath.includes('#')) {
                const parts = targetPath.split('#');
                targetPath = parts[0];
                anchor = parts[1];
            }
            
            // Decode URL (e.g. %20 space)
            try {
                targetPath = decodeURIComponent(targetPath);
            } catch (e) {}

            // Check file existence
            let exists = false;
            let checkPath = targetPath;
            
            try {
                if (fs.existsSync(checkPath)) {
                    const stat = fs.statSync(checkPath);
                    if (stat.isDirectory()) {
                        // Check for README.md or index.md
                        if (fs.existsSync(path.join(checkPath, 'README.md'))) exists = true;
                        else if (fs.existsSync(path.join(checkPath, 'index.md'))) exists = true;
                    } else {
                        exists = true;
                    }
                } else {
                    // Maybe it's a link to a section like /foo/bar.html in VuePress?
                    // But in source it should be .md
                    // Try adding .md if missing
                    if (!checkPath.endsWith('.md') && !checkPath.endsWith('.png') && !checkPath.endsWith('.jpg')) {
                         if (fs.existsSync(checkPath + '.md')) exists = true;
                    }
                }
            } catch (e) {}

            if (!exists) {
                // Find line number
                const lineNum = content.substring(0, match.index).split('\n').length;
                logIssue(absolutePath, lineNum, isImage ? 'Broken Image' : 'Broken Link', `Target not found: ${link}`, `Fix path or create file`);
            }
        }
    }
}

function run() {
    console.log('Starting Audit...');
    checkMarkdownFiles();
    fs.writeFileSync(REPORT_PATH, reportContent);
    console.log(`Audit complete. Report saved to ${REPORT_PATH}`);
}

run();
