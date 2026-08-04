/**
 * Process MDX content and convert to clean markdown
 */
async function processMarkdownFile(content, constants = {}, sourceDir) {
  let result = content;

  // Step 1: Remove import statements
  result = removeImports(result);

  // Step 2: Remove frontmatter (will be added back with minimal info)
  const { frontmatter, body } = extractFrontmatter(result);
  result = body;

  // Step 3: Remove custom JSX components (like TabItem, Tabs, Admonitions if needed)
  // This is a generic way to strip custom tags but keep their inner content if possible
  result = stripJSX(result);

  // Step 4: Clean up excessive whitespace
  result = cleanupWhitespace(result);

  // Add back minimal frontmatter if title exists
  if (frontmatter.title) {
    result = `---\ntitle: ${JSON.stringify(frontmatter.title)}\n---\n\n${result}`;
  }

  return result;
}

function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterBlock = frontmatterMatch[1];
  const frontmatter = {};

  // Parse simple key: value pairs
  const titleMatch = frontmatterBlock.match(/title:\s*(.+)/);
  if (titleMatch) {
    frontmatter.title = titleMatch[1].trim().replace(/^['"](.*)['"]$/, '$1');
  }

  const body = content.slice(frontmatterMatch[0].length);
  return { frontmatter, body };
}

function removeImports(content) {
  // Remove only top-level MDX import statements, preserving imports inside code fences
  const lines = content.split('\n');
  let insideCodeFence = false;
  const fenceRegex = /^(```|~~~)/;
  const importRegex = /^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/;

  const result = lines
    .map((line) => {
      // Toggle code fence state on ``` or ~~~
      if (fenceRegex.test(line)) {
        insideCodeFence = !insideCodeFence;
        return line;
      }

      // If inside a code fence, keep the line as-is (don't remove imports)
      if (insideCodeFence) {
        return line;
      }

      // If not in a code fence and the line is an import, remove it (return empty)
      if (importRegex.test(line)) {
        return '';
      }

      // Otherwise, keep the line
      return line;
    })
    .join('\n');

  return result;
}

function stripJSX(content) {
  let result = content;

  // Remove specifically targeted Docusaurus admonitions (:::tip, :::info, etc.)
  result = result.replace(/^:::[a-z]+\s*$/gm, '');
  result = result.replace(/^:::\s*$/gm, '');

  // Remove common Docusaurus components but keep content
  // <Tabs>...</Tabs>
  result = result.replace(/<Tabs[^>]*>([\s\S]*?)<\/Tabs>/g, '$1');
  // <TabItem[^>]*>...</TabItem>
  result = result.replace(/<TabItem[^>]*>([\s\S]*?)<\/TabItem>/g, '$1');
  // <Details[^>]*>...</Details>
  result = result.replace(/<Details[^>]*>([\s\S]*?)<\/Details>/g, '$1');

  // Remove self-closing or empty components (not followed by content in a tag)
  result = result.replace(/<[A-Z][a-zA-Z0-9]*\s*\/?>/g, '');
  result = result.replace(/<\/[A-Z][a-zA-Z0-9]*>/g, '');

  // Remove div/span tags with classNames but keep content
  result = result.replace(/<(div|span)[^>]*>([\s\S]*?)<\/\1>/g, '$2');

  // Final pass to remove any remaining custom JSX tags with matching closing tags
  // Use backreference to enforce matching opening and closing tag names
  // Run in a loop to handle nested custom components
  let prevResult;
  do {
    prevResult = result;
    result = result.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>([\s\S]*?)<\/\1>/g, '$2');
  } while (result !== prevResult);

  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  return result;
}

function cleanupWhitespace(content) {
  let result = content;

  // Remove excessive blank lines
  result = result.replace(/\n{3,}/g, '\n\n');

  // Remove trailing whitespace from lines
  result = result.replace(/[ \t]+$/gm, '');

  return result.trim() + '\n';
}

module.exports = {
  processMarkdownFile,
};
