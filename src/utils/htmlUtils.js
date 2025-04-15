/**
 * Aggressively strips HTML content for basic Android rich-text compatibility.
 * Removes all attributes and allows only a minimal set of tags.
 * 
 * @param {string} htmlString The original HTML content.
 * @returns {string} The stripped HTML string.
 */

import { isAndroid } from './platform';

export function stripHtmlForAndroidRichText(htmlString) {
  if (!htmlString) return '';
  
  // List of allowed tags for Android rich-text
  const allowedTags = ['p', 'br', 'strong', 'b', 'i', 'em', 'span', 'div', 
                       'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                       'ul', 'ol', 'li'];
  
  // Remove all attributes from tags
  let strippedHtml = htmlString.replace(/<([a-z][a-z0-9]*)\s+[^>]*>/gi, '<$1>');
  
  // Remove all tags not in allowed list
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  strippedHtml = strippedHtml.replace(tagPattern, (match, tagName) => {
    return allowedTags.includes(tagName.toLowerCase()) ? match : '';
  });
  
  return strippedHtml;
}

/**
 * Basic function to convert simple HTML to plain text.
 * @param {string} htmlString 
 * @returns {string}
 */
export function htmlToPlainText(htmlString) {
  if (!htmlString) return '';
  
  // Remove all HTML tags
  const text = htmlString.replace(/<[^>]*>?/gm, '');
  
  // Replace common HTML entities
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Creates a WebView-friendly HTML document from content
 */
export function createWebViewHtml(htmlContent, darkMode = false) {
  const baseStyles = `
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      margin: 16px;
      padding: 0;
      ${darkMode ? 'background-color: #121212; color: #e0e0e0;' : 'background-color: #ffffff; color: #333333;'}
    }
    img { max-width: 100%; height: auto; }
    pre { overflow-x: auto; padding: 8px; background: ${darkMode ? '#222' : '#f5f5f5'}; border-radius: 4px; }
    a { ${darkMode ? 'color: #90CAF9;' : 'color: #1976D2;'} text-decoration: none; }
    code { font-family: monospace; background: ${darkMode ? '#333' : '#f0f0f0'}; padding: 2px 4px; border-radius: 3px; }
    blockquote { border-left: 4px solid ${darkMode ? '#666' : '#ccc'}; margin-left: 0; padding-left: 16px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid ${darkMode ? '#555' : '#ddd'}; padding: 8px; }
    th { background-color: ${darkMode ? '#333' : '#f2f2f2'}; }
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>${baseStyles}</style>
    </head>
    <body>
      ${htmlContent || ''}
    </body>
    </html>
  `;
}

/**
 * Determines best rendering strategy based on platform and content
 */
export function getBestRenderingStrategy(htmlContent) {
  if (!htmlContent) {
    return { strategy: 'empty' };
  }
  
  // For Android, recommend WebView for complex content
  if (isAndroid()) {
    const isComplex = 
      htmlContent.includes('<table') || 
      htmlContent.includes('<iframe') || 
      htmlContent.includes('<img') ||
      htmlContent.includes('<script') || 
      htmlContent.includes('style=') ||
      htmlContent.length > 2000;
      
    return isComplex
      ? { strategy: 'webview', content: createWebViewHtml(htmlContent) }
      : { strategy: 'richtext', content: stripHtmlForAndroidRichText(htmlContent) };
  }
  
  // For non-Android platforms, use native rich-text
  return { strategy: 'richtext', content: htmlContent };
}
