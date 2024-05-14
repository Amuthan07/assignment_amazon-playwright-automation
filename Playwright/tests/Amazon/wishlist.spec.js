// @ts-check
const { test, expect } = require('@playwright/test');
const urlToTest = 'https://www.amazon.in/';

test('add to wishlist/without sign-in' , async ({page}) => {
    //here we are ordering a 'one plus mobile' from the search result
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    for (const element of elements) {
        const text = await element.innerText();
        //const regex = /(oneplus |5g|grey|256gb|8gb)/i; // Case insensitive regex
        const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        if (regex.test(text)) {
            let href = await page.evaluate(el => el.getAttribute('href'), element);
        href = urlToTest+href
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('link', { name: 'Add to Wish List' }).click();
        await page.waitForLoadState('domcontentloaded');

        //it should take us to sign-in page
        expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
        await page.waitForTimeout(5000);
        break; 
        }
        
    }
})

test('add to wishlist/through signed-in' , async({page}) => {
    //here we are ordering a 'one plus mobile' from the search result
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    for (const element of elements) {
        const text = await element.innerText();
        const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        if (regex.test(text)) {

            let href = await page.evaluate(el => el.getAttribute('href'), element);
        href = urlToTest+href
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('link', { name: 'Add to Wish List' }).click();

        await page.waitForLoadState('domcontentloaded');
        //it should take us to sign-in page

        await page.waitForTimeout(5000);

        await page.getByLabel('Email or mobile phone number').fill('9080394715');
        await page.getByLabel('Continue').click();
        await page.getByLabel('Password').fill('audiR8etron$');

        await page.getByLabel('Sign in').click();
        await page.waitForLoadState('domcontentloaded');
        const currentUrl = page.url();


        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('link', { name: 'Add to Wish List' }).click();

        await page.waitForLoadState('domcontentloaded');

        expect(page.getByText('One item added to')).toBeVisible()

        await page.getByRole('link', { name: 'View Your List' }).click();
        const pageText = await page.textContent('body');
        // @ts-ignore
        const containsText = pageText.includes(text);

        //checking if the added item is present in the list
        expect(containsText).toBeTruthy();

        }

        break;
    }
})

test('remove from the list', async ({page}) => {
    //here we are ordering a 'one plus mobile' from the search result
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    for (const element of elements) {
        const text = await element.innerText();
        const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        if (regex.test(text)) {
            console.log(text);
            console.log("it matches")
            let href = await page.evaluate(el => el.getAttribute('href'), element);
        href = urlToTest+href
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('link', { name: 'Add to Wish List' }).click();

        await page.waitForLoadState('domcontentloaded');
        //it should take us to sign-in page
        await page.waitForTimeout(5000);

        await page.getByLabel('Email or mobile phone number').fill('9080394715');
        await page.getByLabel('Continue').click();
        await page.getByLabel('Password').fill('audiR8etron$');
        //await page.getByText('Sign in Keep me signed in.').click();
        await page.getByLabel('Sign in').click();
        await page.waitForLoadState('domcontentloaded');
   
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('link', { name: 'Add to Wish List' }).click();

        await page.waitForLoadState('domcontentloaded');
       // checking if the item is added

        await page.getByRole('link', { name: 'View Your List' }).click();
        const pageText = await page.textContent('body');
        // @ts-ignore
        const containsText = pageText.includes(text);
        //checking if the added item is present in the list

        //remove an item form the list
        await page.click('input[name="submit.deleteItem"]');
        //verify if it's deleted
        expect(page.getByText('Deleted')).toBeVisible();
        }

        break;
    }

})

test('add to cart from wishlist', async({page}) => {
    //here we are ordering a 'one plus mobile' from the search result
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    for (const element of elements) {
        const text = await element.innerText();
        const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        
    
        if (regex.test(text)) {

            let href = await page.evaluate(el => el.getAttribute('href'), element);
        href = urlToTest+href
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('link', { name: 'Add to Wish List' }).click();

        await page.waitForLoadState('domcontentloaded');
        //it should take us to sign-in page

        await page.waitForTimeout(5000);

        await page.getByLabel('Email or mobile phone number').fill('9080394715');
        await page.getByLabel('Continue').click();
        await page.getByLabel('Password').fill('audiR8etron$');

        await page.getByLabel('Sign in').click();
        await page.waitForLoadState('domcontentloaded');


        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);
        await page.getByLabel('Add to Wish List').click();

        await page.waitForLoadState('domcontentloaded');
       // checking if the item is added


        await page.getByRole('link', { name: 'View Your List' }).click();

        await page.getByRole('link', { name: 'Add to Cart' }).first().click();

        expect(page.getByText('Added to Cart')).toBeVisible();
        await page.getByRole('link',{name: 'Proceed to checkout'}).click()

        expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();



        break;
        
        }
    }
})
test('view wishlist/already signed in', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.getByLabel('Email or mobile phone number').fill('9080394715');
    await page.getByLabel('Continue').click();
    await page.getByLabel('Password').fill('audiR8etron$');
    //await page.getByText('Sign in Keep me signed in.').click();
    await page.getByLabel('Sign in').click();
    await page.waitForLoadState('domcontentloaded');
    //search an item
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    for (const element of elements) {
        const text = await element.innerText();

        const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        
    
        if (regex.test(text)) {

            let href = await page.evaluate(el => el.getAttribute('href'), element);

        href = urlToTest+href
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);
        await page.getByLabel('Add to Wish List').click();

        await page.waitForLoadState('domcontentloaded');
       // checking if the item is added


        await page.getByRole('link', { name: 'View Your List' }).click();
        const pageText = await page.textContent('body');
        // @ts-ignore
        const containsText = pageText.includes(text);
        //checking if the added item is present in the list
        expect(containsText).toBeTruthy();

        break;
        
        }
    }


})

test('check if an item is already added', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.getByLabel('Email or mobile phone number').fill('9080394715');
    await page.getByLabel('Continue').click();
    await page.getByLabel('Password').fill('audiR8etron$');

    await page.getByLabel('Sign in').click();
    await page.waitForLoadState('domcontentloaded');
    //search an item
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    for (const element of elements) {

        const text = await element.innerText();

        const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        
    
        if (regex.test(text)) {
            console.log(text);
            console.log("it matches")
            let href = await page.evaluate(el => el.getAttribute('href'), element);
        href = urlToTest+href
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);
        await page.getByLabel('Add to Wish List').click();

        await page.waitForLoadState('domcontentloaded');
       // checking if the item is added
       const pageText = await page.textContent('body');
       // @ts-ignore
       const containsText = pageText.includes('This item was already in');
       expect(containsText).toBeTruthy();
        break;
        
        }
    }


})