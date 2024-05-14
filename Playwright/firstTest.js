const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch(
        {
            headless: false
        }
    );
    const page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name','standard_user');
    await page.screenshot({path: 'test.png'})
    await browser.close();
})();