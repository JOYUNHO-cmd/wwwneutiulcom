import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);

// Render the real contact components with a changed company setting, without
// connecting to Firebase or dispatching analytics/contact events.
function loadContactComponent(filename, site) {
  const source = readFileSync(new URL(`../components/${filename}`, import.meta.url), 'utf8');
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
    if (specifier === '../context/SiteContext') return { useSite: () => site };
    if (specifier === '../lib/analytics') return { trackEvent: () => {} };
    if (specifier === './KakaoConfirmModal') return { default: () => null, __esModule: true };
    return require(specifier);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  return module.exports.default;
}

for (const filename of ['MobileStickyBar.tsx', 'FloatingContactButtons.tsx']) {
  test(`${filename} follows the updated company phone number`, () => {
    const site = { config: { companyInfo: { phone: '010-4880-7386' } } };
    const Component = loadContactComponent(filename, site);
    const render = () => renderToStaticMarkup(React.createElement(Component));
    assert.match(render(), /href="tel:01048807386"/);
    site.config.companyInfo.phone = '02) 1234-5678';
    const updated = render();
    assert.match(updated, /href="tel:0212345678"/);
    assert.doesNotMatch(updated, /href="tel:01048807386"/);
    assert.match(updated, /href="https:\/\/open\.kakao\.com\/o\/srNJGmpg"/);
  });
}
