import * as prettier from 'prettier/standalone';
import * as babel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';
import * as html from 'prettier/plugins/html';
import * as postcss from 'prettier/plugins/postcss';
import * as yaml from 'prettier/plugins/yaml';
import * as markdown from 'prettier/plugins/markdown';
import * as xml from '@prettier/plugin-xml';
import * as sql from 'prettier-plugin-sql';

export async function formatCode(code: string, language: string): Promise<string> {
  const options: any = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    printWidth: 80,
    plugins: [babel, estree, html, postcss, yaml, markdown, xml, sql],
  };

  try {
    switch (language) {
      case 'javascript':
        options.parser = 'babel';
        break;
      case 'typescript':
        options.parser = 'babel-ts';
        break;
      case 'json':
        options.parser = 'json';
        break;
      case 'html':
        options.parser = 'html';
        break;
      case 'css':
        options.parser = 'css';
        break;
      case 'yaml':
        options.parser = 'yaml';
        break;
      case 'markdown':
        options.parser = 'markdown';
        break;
      case 'xml':
        options.parser = 'xml';
        break;
      case 'sql':
        options.parser = 'sql';
        break;
      default:
        return code;
    }

    return await prettier.format(code, options);
  } catch (error) {
    console.error('Formatting error:', error);
    return code;
  }
}

export function minifyCode(code: string, language: string): string {
  try {
    switch (language) {
      case 'json':
        return JSON.stringify(JSON.parse(code));
      case 'javascript':
      case 'typescript':
      case 'css':
      case 'html':
        // Simple regex-based minification for demo purposes
        // In a real app, you'd use a proper minifier
        return code
          .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '') // remove comments
          .replace(/\s+/g, ' ') // collapse whitespace
          .replace(/\s*([{};,:])\s*/g, '$1') // remove space around separators
          .trim();
      default:
        return code;
    }
  } catch (error) {
    console.error('Minification error:', error);
    return code;
  }
}
