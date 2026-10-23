import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { PassThrough } from 'node:stream';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { parse } from 'node-html-parser';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadPage(filename, site) {
  const source = readFileSync(new URL(`../${filename}`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const module = { exports: {} };
  const resolve = (specifier) => {
    if (specifier.endsWith('/context/SiteContext')) return { useSite: () => site };
    if (specifier.endsWith('/lib/analytics')) return { trackEvent: () => {} };
    // The surrounding gallery/review/logo sections do not own the editable
    // company copy. Omit their data and effects, including lazy sections.
    if (specifier.startsWith('.')) return { default: () => null, __esModule: true };
    return require(specifier);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  return module.exports.default;
}

function renderPage(Component) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const output = new PassThrough();
    output.on('data', chunk => chunks.push(chunk));
    output.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    output.on('error', reject);
    const stream = renderToPipeableStream(
      React.createElement(MemoryRouter, null, React.createElement(Component)),
      {
        progressiveChunkSize: Number.POSITIVE_INFINITY,
        onAllReady() { stream.pipe(output); },
        onError: reject,
      }
    );
  });
}

for (const [filename, field] of [
  ['pages/Home.tsx', 'slogan'],
  ['pages/About.tsx', 'description'],
  ['components/Footer.tsx', 'description'],
]) {
  test(`${filename} renders updated company ${field} as plain text`, async () => {
    const site = {
      config: {
        companyInfo: {
          name: 'Test company', phone: '010-1234-5678', email: 'test@example.com',
          address: 'Test address', logo: '/images/logo.webp',
          blog: 'https://example.com/blog', blog2: 'https://example.com/blog2',
          slogan: '기존 슬로건 테스트', description: '기존 업체 설명 테스트',
        },
        services: [],
      },
    };
    const originalValue = site.config.companyInfo[field];
    const Component = loadPage(filename, site);
    const original = await renderPage(Component);
    assert.ok(parse(original).text.includes(originalValue));

    const changed = '변경한 회사 안내\n두 번째 줄 & <script data-test-injected="yes">alert(1)</script>';
    site.config.companyInfo[field] = changed;
    const updated = await renderPage(Component);
    const document = parse(updated);
    assert.ok(document.text.includes('변경한 회사 안내'));
    assert.ok(document.text.includes('두 번째 줄 & <script data-test-injected="yes">alert(1)</script>'));
    assert.ok(!document.text.includes(originalValue));
    assert.equal(document.querySelector('script[data-test-injected]'), null);
    assert.ok(updated.includes('&lt;script'));
  });
}
