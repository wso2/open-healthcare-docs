const fs = require('fs');
const path = require('path');
const { processMarkdownFile } = require('./mdxProcessor');

module.exports = function pluginMarkdownExport(context, options = {}) {
  const { siteDir } = context;

  // Recursively find all .md and .mdx files
  function findMarkdownFiles(dir, baseDir = dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip excluded content directories
        if (entry.name === 'old-content') continue;
        files.push(...findMarkdownFiles(fullPath, baseDir));
      } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
        // Skip hidden files and category files
        if (entry.name.startsWith('.') || entry.name.startsWith('_') || entry.name === 'category.json') continue;

        const relativePath = path.relative(baseDir, fullPath);
        // Convert to slug (remove extension, use forward slashes)
        const slug = relativePath.replace(/\.(md|mdx)$/, '').split(path.sep).join('/');
        files.push({ fullPath, slug });
      }
    }
    return files;
  }

  // Export markdown files
  async function exportAllDocs(outputBaseDir) {
    let totalExported = 0;
    const docsDir = path.join(siteDir, 'docs');

    if (!fs.existsSync(docsDir)) {
      console.warn('[markdown-export] docs directory not found');
      return 0;
    }

    const files = findMarkdownFiles(docsDir);
    console.log(`[markdown-export] Processing ${files.length} docs`);

    for (const { fullPath, slug } of files) {
      const outputPath = path.join(outputBaseDir, 'docs', slug + '.md');

      try {
        const sourceContent = fs.readFileSync(fullPath, 'utf-8');
        const cleanMarkdown = await processMarkdownFile(
          sourceContent,
          {}, // No constants for now
          path.dirname(fullPath)
        );

        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, cleanMarkdown);
        totalExported++;
      } catch (error) {
        console.error(`[markdown-export] Error processing ${fullPath}:`, error.message);
      }
    }

    return totalExported;
  }

  return {
    name: 'docusaurus-plugin-markdown-export',

    // Generate during development
    async loadContent() {
      console.log('[markdown-export] Generating markdown files for development...');
      const staticDocsDir = path.join(siteDir, 'static');
      const totalExported = await exportAllDocs(staticDocsDir);
      console.log(`[markdown-export] Exported ${totalExported} markdown files to static/docs/`);
    },

    // Generate during build
    async postBuild({ outDir }) {
      console.log('[markdown-export] Generating markdown files for build...');
      const totalExported = await exportAllDocs(outDir);
      console.log(`[markdown-export] Exported ${totalExported} markdown files to build/docs/`);
    },
  };
};
