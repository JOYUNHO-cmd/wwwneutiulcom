import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import ts from 'typescript';
import { FAQ_DATA } from '../lib/faqData.mjs';
import {
  createLoader, createHookHarness, files, render, renderTree, hash,
  withoutClasses, contentProjection, normalize, elements, elementText,
} from './support/home-desktop-renderer.mjs';

const baseline = JSON.parse(readFileSync(new URL('./fixtures/home-desktop-layout-baseline.json', import.meta.url), 'utf8'));
const load = createLoader();
const allQuestions = baseline.faq.data.flatMap(category => category.qas);
const questionButtons = document => document.querySelectorAll('button[aria-expanded][aria-controls*="answer-"]');
const expandedQuestions = document => questionButtons(document).filter(button => button.getAttribute('aria-expanded') === 'true');
const byId = (document, id) => document.querySelectorAll('[id]').find(node => node.getAttribute('id') === id);
const visibleQuestions = document => questionButtons(document).filter(button => {
  for (let node = button; node; node = node.parentNode) if (node.hasAttribute?.('hidden')) return false;
  return true;
});
const questionText = button => normalize(button.textContent).replace(/^Q\s*/, '');
const buttonElement = (tree, text) => elements(tree).find(node => node.type === 'button' && normalize(elementText(node)) === text);

function assertQuestions(scope, document, expected) {
  const buttons = questionButtons(scope);
  assert.deepEqual(buttons.map(questionText), expected.map(qa => normalize(qa.q)), 'Every question must remain once, in its original order, within this view');
  for (const [index, button] of buttons.entries()) {
    const answer = byId(document, button.getAttribute('aria-controls'));
    assert.ok(answer, 'The question must control an existing answer');
    assert.equal(normalize(answer.textContent).replace(/^A\s*/, ''), normalize(expected[index].a), 'Do not shorten or change the original answer');
  }
}

test('the five-step section preserves all original copy and responsive images in order', () => {
  const document = parse(render(load(files.workflow).default));
  const navigation = document.querySelector('nav[aria-label="5단계 진행 과정"]');
  assert.ok(navigation, 'Desktop navigation must be named for assistive technology');
  const links = navigation.querySelectorAll('a[href]');
  assert.equal(links.length, baseline.workflow.images.length);
  assert.equal(links.filter(link => link.getAttribute('aria-current') === 'step').length, 1);
  for (const [index, link] of links.entries()) {
    const target = byId(document, link.getAttribute('href').slice(1));
    assert.ok(target, 'Every shortcut must reach an existing step');
    assert.equal(target.getAttribute('tabindex'), '-1', 'The step must accept focus without adding a tab stop');
    assert.equal(target.querySelector('img').getAttribute('src'), baseline.workflow.images[index].src);
  }
  navigation.remove();
  assert.deepEqual(contentProjection(document.toString()), baseline.workflow, 'The mobile/tablet reading content, images and links must stay unchanged');
});

test('pricing preserves its original explanation, amounts, headings and quote link', () => {
  assert.deepEqual(contentProjection(render(load(files.pricing).default)), baseline.pricing);
  const events = [];
  const harness = createHookHarness(files.pricing, {}, { trackEvent: (...args) => events.push(args) });
  const link = elements(harness.render()).find(node => node.props.to === '/contact');
  assert.ok(link);
  link.props.onClick();
  assert.deepEqual(events, [['contact_click', { method: 'quote', location: 'home_pricing' }]]);
});

test('the shared FAQ default HTML remains byte-for-byte unchanged for home and service CTAs', () => {
  const Component = load(files.faq).default;
  assert.equal(hash(render(Component)), baseline.faq.htmlSha256);
  assert.equal(hash(render(Component, { ctaPhone: '010-1234-5678' })), baseline.faq.servicePhoneHtmlSha256);
  assert.deepEqual(FAQ_DATA, baseline.faq.data, 'The layout change must not rewrite the FAQ or its schema source');
});

test('home opt-in preserves the complete mobile FAQ and each desktop question without conflicting IDs', () => {
  const document = parse(render(load(files.faq).default, { desktopLayout: true }));
  const desktop = document.querySelector('.home-faq-desktop');
  assert.ok(desktop);
  assertQuestions(desktop, document, allQuestions);
  assert.equal(desktop.querySelector('button[aria-pressed="true"]').textContent, '전체 보기');
  assert.deepEqual(visibleQuestions(desktop).map(questionText), allQuestions.slice(0, 4).map(qa => normalize(qa.q)));
  const ids = document.querySelectorAll('[id]').map(node => node.getAttribute('id'));
  assert.equal(new Set(ids).size, ids.length, 'The two views must not share answer or question IDs');
  for (const control of document.querySelectorAll('[aria-controls], [aria-labelledby]')) {
    for (const attribute of ['aria-controls', 'aria-labelledby']) {
      for (const id of (control.getAttribute(attribute) || '').split(/\s+/).filter(Boolean)) assert.ok(byId(document, id), `${attribute} must resolve to an existing unique element`);
    }
  }
  desktop.remove();
  assert.equal(hash(withoutClasses(document.toString())), baseline.faq.structureWithoutClassesSha256, 'After removing the desktop-only view, original mobile HTML, state and accessibility must remain');
  assert.deepEqual(contentProjection(document.toString()), baseline.faq.content);
  assertQuestions(document, document, allQuestions);
  assert.equal(visibleQuestions(document).length, 0, 'Mobile must retain the initial category chooser');
});

test('desktop FAQ category selection and answer toggles use the full original content', () => {
  const harness = createHookHarness(files.desktopFaq);
  let tree = harness.render();
  const categories = [{ category: 'all', categoryName: '전체 보기', qas: allQuestions }, ...baseline.faq.data];
  for (const category of categories) {
    buttonElement(tree, category.categoryName).props.onClick();
    tree = harness.render();
    let document = parse(renderTree(tree));
    if (category.category === 'all') {
      assert.equal(visibleQuestions(document).length, 4);
      elements(tree).find(node => node.props['data-faq-disclosure'] === 'more').props.onClick();
      tree = harness.render();
      document = parse(renderTree(tree));
    }
    assert.deepEqual(visibleQuestions(document).map(questionText), category.qas.map(qa => normalize(qa.q)));
    assert.equal(document.querySelectorAll('button[aria-pressed="true"]').length, 1);
    assert.equal(document.querySelector('button[aria-pressed="true"]').textContent, category.categoryName);
    assert.equal(expandedQuestions(document).length, 0, 'Changing category closes the previous answer');
    const firstQuestion = category.qas[0];
    const first = elements(tree).find(node => node.type === 'button' && node.props['aria-expanded'] !== undefined && normalize(elementText(node)) === `Q${normalize(firstQuestion.q)}`);
    first.props.onClick();
    tree = harness.render();
    document = parse(renderTree(tree));
    const expanded = expandedQuestions(document);
    assert.equal(expanded.length, 1);
    assert.equal(questionText(expanded[0]), normalize(firstQuestion.q));
    const answer = byId(document, expanded[0].getAttribute('aria-controls'));
    assert.equal(answer.hasAttribute('hidden'), false);
    assert.equal(normalize(answer.textContent).replace(/^A\s*/, ''), normalize(firstQuestion.a));
    // Click the current handler, so the test covers closing as well as opening.
    elements(tree).find(node => node.type === 'button' && node.props['aria-expanded'] === true && node.props.id?.includes('-question-')).props.onClick();
    tree = harness.render();
    document = parse(renderTree(tree));
    assert.equal(expandedQuestions(document).length, 0);
    assert.equal(byId(document, answer.getAttribute('id')).hasAttribute('hidden'), true);
    // Leave an answer open to check the next category really resets it.
    elements(tree).find(node => node.type === 'button' && node.props['aria-controls'] === answer.getAttribute('id')).props.onClick();
    tree = harness.render();
  }
});

test('desktop more control reveals all original questions and resets when returning to all', () => {
  const harness = createHookHarness(files.desktopFaq);
  let tree = harness.render();
  const more = () => elements(tree).find(node => node.props['data-faq-disclosure'] === 'more');
  const question = index => elements(tree).filter(node => node.type === 'button' && node.props.id?.includes('-question-'))[index];
  assert.equal(more().props['aria-expanded'], false);
  question(0).props.onClick();
  tree = harness.render();
  more().props.onClick();
  tree = harness.render();
  let document = parse(renderTree(tree));
  assert.deepEqual(visibleQuestions(document).map(questionText), allQuestions.map(qa => normalize(qa.q)));
  assert.equal(more().props['aria-expanded'], true);
  const disclosureTarget = more().props['aria-controls'];
  assert.equal(byId(document, disclosureTarget).hasAttribute('hidden'), false);
  more().props.onClick();
  tree = harness.render();
  document = parse(renderTree(tree));
  assert.equal(visibleQuestions(document).length, 4);
  assert.equal(expandedQuestions(document).length, 1, 'Collapsing more must preserve an open answer among the first four');
  more().props.onClick();
  tree = harness.render();
  question(4).props.onClick();
  tree = harness.render();
  more().props.onClick();
  tree = harness.render();
  document = parse(renderTree(tree));
  assert.equal(expandedQuestions(document).length, 0, 'Collapsing more closes a now-hidden answer');
  assert.equal(byId(document, disclosureTarget).hasAttribute('hidden'), true);
  more().props.onClick();
  tree = harness.render();
  buttonElement(tree, '작업 과정 & 범위').props.onClick();
  tree = harness.render();
  assert.equal(more(), undefined);
  buttonElement(tree, '전체 보기').props.onClick();
  tree = harness.render();
  assert.equal(visibleQuestions(parse(renderTree(tree))).length, 4);
  assert.equal(more().props['aria-expanded'], false);
});

test('mobile FAQ retains the chooser, dropdown selection and single-answer interaction', () => {
  const harness = createHookHarness(files.faq);
  let tree = harness.render();
  assert.equal(visibleQuestions(parse(renderTree(tree))).length, 0);
  buttonElement(tree, '전체 질문 보기').props.onClick();
  tree = harness.render();
  assert.equal(visibleQuestions(parse(renderTree(tree))).length, allQuestions.length);
  const questions = elements(tree).filter(node => node.type === 'button' && node.props['aria-controls']);
  questions[0].props.onClick();
  tree = harness.render();
  let document = parse(renderTree(tree));
  let expanded = document.querySelector('button[aria-expanded="true"][aria-controls]');
  assert.ok(expanded);
  assert.equal(byId(document, expanded.getAttribute('aria-controls')).hasAttribute('inert'), false);
  elements(tree).filter(node => node.type === 'button' && node.props['aria-controls'])[1].props.onClick();
  tree = harness.render();
  document = parse(renderTree(tree));
  assert.equal(document.querySelectorAll('button[aria-expanded="true"][aria-controls]').length, 1);
  assert.equal(byId(document, expanded.getAttribute('aria-controls')).hasAttribute('inert'), true);
  const dropdown = elements(tree).find(node => node.type === 'button' && node.props['aria-expanded'] !== undefined && !node.props['aria-controls']);
  dropdown.props.onClick();
  tree = harness.render();
  const category = baseline.faq.data.at(-1);
  buttonElement(tree, category.categoryName).props.onClick();
  tree = harness.render();
  document = parse(renderTree(tree));
  assert.deepEqual(visibleQuestions(document).map(questionText), category.qas.map(qa => normalize(qa.q)));
  assert.equal(document.querySelectorAll('button[aria-expanded="true"]').length, 0, 'Category selection must close both dropdown and answer');
});

test('step shortcuts center the image card, keep tall cards below the header and respect reduced motion', () => {
  const originalWindow = globalThis.window;
  try {
    for (const reducedMotion of [false, true]) {
      for (const viewport of [{ height: 1100, scrollTop: 675 }, { height: 650, scrollTop: 850 }]) {
        const calls = [];
        globalThis.window = {
          innerHeight: viewport.height,
          scrollY: 300,
          scrollTo: options => calls.push(['scroll', options]),
          matchMedia: query => ({ matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion }),
        };
        const harness = createHookHarness(files.workflow);
        const tree = harness.render();
        const targets = elements(tree).filter(node => typeof node.props.ref === 'function' && node.props.id);
        targets.forEach(node => node.props.ref({
          focus: options => calls.push([node.props.id, 'focus', options]),
          getBoundingClientRect: () => ({ top: 700 }),
          firstElementChild: { offsetHeight: 600 },
          offsetHeight: 800, // Includes the connector, which must not affect centering.
        }));
        const links = elements(tree).filter(node => node.type === 'a' && node.props.href?.startsWith('#'));
        for (const link of links) {
          let prevented = false;
          link.props.onClick({ preventDefault: () => { prevented = true; } });
          assert.ok(prevented);
          assert.deepEqual(calls.splice(0), [
            [link.props.href.slice(1), 'focus', { preventScroll: true }],
            ['scroll', { top: viewport.scrollTop, behavior: reducedMotion ? 'instant' : 'smooth' }],
          ]);
        }
      }
    }
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});

test('the desktop FAQ is explicitly opted into only at the home call site', () => {
  function usages(filename) {
    const source = ts.createSourceFile(filename, readFileSync(new URL(`../${filename}`, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const result = [];
    function visit(node) {
      if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(source) === 'FAQSection') result.push(node.attributes.properties);
      ts.forEachChild(node, visit);
    }
    visit(source);
    return result;
  }
  const home = usages('pages/Home.tsx');
  const service = usages('pages/ServiceLanding.tsx');
  assert.equal(home.length, 1);
  assert.equal(service.length, 1);
  assert.ok(home[0].some(prop => prop.name?.text === 'desktopLayout' && !prop.initializer));
  assert.ok(!service[0].some(prop => prop.name?.text === 'desktopLayout'));
  assert.ok(service[0].some(prop => prop.name?.text === 'ctaPhone'));
});
