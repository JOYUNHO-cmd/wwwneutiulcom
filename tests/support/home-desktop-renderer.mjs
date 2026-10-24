import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { parse } from 'node-html-parser';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
export const files = {
  workflow: 'components/home/FiveStepWorkflowSection.tsx',
  pricing: 'components/home/TransparentPricingSection.tsx',
  faq: 'components/FAQSection.tsx',
  desktopFaq: 'components/home/HomeDesktopFAQ.tsx',
};

// Render the actual components. Only CSS (checked in the browser) and analytics
// side effects are excluded; React, Router, Motion and icons are real modules.
export function createLoader({ sources = {}, react = React, trackEvent = () => {} } = {}) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    cache.set(filename, module.exports);
    const localRequire = specifier => {
      if (specifier.endsWith('.css')) return {};
      if (specifier === 'react') return react;
      if (/(^|\/)lib\/analytics$/.test(specifier)) return { trackEvent };
      if (!specifier.startsWith('.')) return require(specifier);
      const target = resolve(root, dirname(filename), specifier);
      const pathname = [target, `${target}.tsx`, `${target}.ts`, `${target}.mjs`].find(path => existsSync(path));
      if (!pathname) throw new Error(`Cannot resolve ${specifier} from ${filename}`);
      const key = relative(root, pathname).replaceAll('\\', '/');
      if (/\.(tsx?|mjs)$/.test(key)) return load(key);
      return require(pathname);
    };
    const source = sources[filename] ?? readFileSync(resolve(root, filename), 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
      fileName: filename.replace(/\.mjs$/, '.js'),
    });
    new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
    cache.set(filename, module.exports);
    return module.exports;
  }
  return load;
}

export const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
export const hash = value => createHash('sha256').update(value).digest('hex');
export const renderTree = tree => renderToStaticMarkup(React.createElement(MemoryRouter, null, tree));
export const render = (Component, props = {}) => renderTree(React.createElement(Component, props));

export function contentProjection(html) {
  const document = parse(html);
  document.querySelectorAll('style, script, svg').forEach(node => node.remove());
  const imageAttributes = ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding', 'referrerpolicy'];
  return {
    text: normalize(document.textContent),
    headings: document.querySelectorAll('h1, h2, h3, h4').map(node => ({ tag: node.tagName, text: normalize(node.textContent) })),
    images: document.querySelectorAll('img').map(node => Object.fromEntries(imageAttributes.map(name => [name, node.getAttribute(name) ?? null]))),
    links: document.querySelectorAll('a[href]').map(node => ({ href: node.getAttribute('href'), text: normalize(node.textContent), target: node.getAttribute('target') ?? null, rel: node.getAttribute('rel') ?? null })),
  };
}

// Strip only classes for a structural/content baseline. All accessibility,
// hidden/inert state, styles, destinations and other HTML attributes remain.
export function withoutClasses(html) {
  const document = parse(html);
  document.querySelectorAll('[class]').forEach(node => node.removeAttribute('class'));
  return document.toString();
}

// Exercise the handlers returned by the real function component without a DOM
// simulator. Browser layout, focus behavior and hydration remain browser checks.
export function createHookHarness(filename, props = {}, options = {}) {
  const slots = [];
  let cursor = 0;
  const react = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], next => { slots[index] = typeof next === 'function' ? next(slots[index]) : next; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useId() {
      const index = cursor++;
      return `test-${index}`;
    },
    useEffect() { cursor++; },
  };
  const Component = createLoader({ ...options, react })(filename).default;
  return { render: () => { cursor = 0; return Component(props); } };
}

export function elements(tree) {
  const result = [];
  function visit(node) {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!React.isValidElement(node)) return;
    result.push(node);
    visit(node.props.children);
  }
  visit(tree);
  return result;
}

export function elementText(node) {
  if (Array.isArray(node)) return node.map(elementText).join('');
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  return React.isValidElement(node) ? elementText(node.props.children) : '';
}
