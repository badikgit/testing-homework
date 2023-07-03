const { assert } = require("chai");

/* !!!
  Почему-то запущенный сервер всегда пересобирается перед запуском гермионы,
  и тогда обычно первый тест из общих требований отрабатывает раньше, чем сервер готов выдавать ответы,
  соответственно тест может упасть не по причине бага.

  Для перепроверки конкретного бага можно изменить переменную ниже (bugId), например так:

  const bugId = '4';

  и затем перезапустить нужный тест из отчёта, который можно запустить так

  npx hermione gui
*/
const bugId = '';

let BUG_ID = process.env.BUG_ID || bugId;

const getPathFromRoute = (route) => `http://localhost:3000/hw/store${route}${!BUG_ID ? '': `?bug_id=${BUG_ID}`}`;

describe("Общие требования:\n", () => {
  it("Вёрстка должна адаптироваться под ширину экрана", async ({ browser }) => {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    const widthSizes = [1280, 768, 575];
    const routes = ["/", "/delivery", "/contacts", "/cart"];

    async function testAdaptiveWidthOfRoute(width, route) {
      const path = getPathFromRoute(route);
      await page.goto(path);
      await page.setViewport({ width, height: 1080 });
      await page.waitForSelector(".Application");
      await browser.assertView(`plain-${route.slice(1)}.width-${width}px`, ".Application", { screenshotDelay: 100 });
    }

    for await (const route of routes) {
      for await (const width of widthSizes) {
        await testAdaptiveWidthOfRoute(width, route);
      }
    }
  });

  it('На ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async ({ browser }) => {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    const path = getPathFromRoute('/');
    await page.goto(path);
    await page.setViewport({ width: 575, height: 1080 });

    const menu = await browser.$(".Application-Menu");
    const burger = await browser.$(".Application-Toggler");

    assert.equal(await menu.isDisplayed(), false, 'Навигационное меню должно скрываться за "гамбургер" на ширине меньше 576px');
    assert.equal(await burger.isDisplayed(), true, '"Гамбургер" должен отображаться на ширине меньше 576px');

    await page.setViewport({ width: 576, height: 1080 });

    assert.equal(await menu.isDisplayed(), true, 'Навигационное меню должно отображаться на ширине 576px и больше');
    assert.equal(await burger.isDisplayed(), false, '"Гамбургер" не должен отображаться на ширине 576px и больше');
  });

  it('При выборе элемента из меню "гамбургера", меню должно закрываться', async ({ browser }) => {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    const path = getPathFromRoute('/');
    await page.goto(path);
    await page.setViewport({ width: 575, height: 1080 });

    const menu = await browser.$(".Application-Menu");
    const burger = await browser.$(".Application-Toggler");

    assert.equal(await menu.isDisplayed(), false, 'Навигационное меню должно скрываться за "гамбургер" на ширине меньше 576px');

    await burger.click();

    assert.equal(await menu.isDisplayed(), true, 'Навигационное меню должно появиться при клике на "гамбургер" на ширине меньше 576px');

    const menuItems = await browser.$$(".nav-link");
    await menuItems[0].click();

    assert.equal(await menu.isDisplayed(), false, 'При выборе элемента из меню "гамбургера", меню должно закрываться на ширине меньше 576px');
  });
});
