const { test, expect } = require('@playwright/test');
const exp = require('constants');
const urlToTest = 'https://www.amazon.in';

function generateRandomString(length,flag) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const specialCharacters = '~!@#$%^&*()_+';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        randomString += char;
    
    if(flag === 0){
        const randomIndex = Math.floor(Math.random() * length);
        const randomSpecialChar = specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
        randomString = randomString.substring(0, randomIndex) + randomSpecialChar + randomString.substring(randomIndex + 1);
      }
  }
  return randomString;
}

test('show the result with the given product name', async({page}) => {
    //let's take a product named OnePlus nord ce 5g
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    const suggestions = await page.waitForSelector('.autocomplete-results-container');
    if(suggestions)
         console.log("suggestion box came up")
    const hasAriaLabel = await suggestions.$('[aria-label]');
    if(hasAriaLabel)
        console.log('The container has elements with aria-label attribute.');

    // for (const result of suggestions) {
    //     const title = await result.textContent();
    //     expect(title).toContain('oneplus'); // Check that the title contains a relevant keyword
    //   }

    // if(await page.waitForSelector('.autocomplete-results-container'))
    //     console.log("suggestion box came up")
    // const container = await page.waitForSelector('.autocomplete-results-container');
    // let foundOnePlus = false;
    // if (container) {
    //     const hasAriaLabel = await container.$('[aria-label]');
    //     if (hasAriaLabel) {
    //         console.log('The container has elements with aria-label attribute.');
    //         const ariaLabels = await Promise.all(hasAriaLabel.map(el => el.getAttribute('aria-label')));
    //         for (const element of ariaLabels){
    //         const ariaLabel = await element.getAttribute('aria-label');
    //         console.log(ariaLabel)
    //         if (ariaLabel && ariaLabel.startsWith('oneplus')) {
    //             foundOnePlus = true;
    //             break;
    //         }
    //         }
    //     } else {
    //         console.log('The container does not have any elements with aria-label attribute.');
    //     }
    // } else {
    //     console.log('The container with class .autocomplete-results-container was not found.');
    // }
    // await expect(foundOnePlus).toBeTruthy();
    
})

test('search results', async({page}) => {
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    expect(page.getByText('results for Oneplus nord ce 5g')).toBeVisible;

    const searchResults = await page.$$('.search');
    expect(searchResults).not.toBeNull(); 
    expect(searchResults).toBeTruthy();

    for (const result of searchResults) {
        const title = await result.textContent();
        expect(title).toContain('oneplus');
      }
    
})

test('search results, case sensitive', async({page}) => {
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('ONEPLUS NORD CE 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    expect(page.getByText('results for Oneplus nord ce 5g')).toBeVisible;

    const searchResults = await page.$$('.search');
    expect(searchResults).not.toBeNull(); 
    expect(searchResults).toBeTruthy();

    for (const result of searchResults) {
        const title = await result.textContent();
        expect(title).toContain('oneplus'); 
      }
    
})


test('search without entering', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const currentUrl = page.url();
    await expect(currentUrl).toBe(urlToTest);
})

test('search with entering blank spaces', async({page}) => {
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('   ');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const currentUrl = page.url();
    await expect(currentUrl).toBe(urlToTest);
})

test('search with random string', async({page}) => {
    await page.goto(urlToTest);
    const randomString = generateRandomString(10,0);
    await page.getByPlaceholder('Search Amazon.in').fill(randomString);
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    expect(page.getByText(`results for ${randomString}`)).toBeVisible;

    try {
        // @ts-ignore
        const messageElement = await page.waitForSelector('heading-selector', { text: 'There was a problem' }, { timeout: 5000 });
        const isVisible = await messageElement.isVisible();
        expect(isVisible).toBe(true);

      } catch (error) {
        throw new Error('The expected message /There was a problem/ is not displayed after clicking the button');
      }

});
test('check the cart',async({page}) => {
    //here we are ordering a 'one plus mobile' from the search result
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    for (const element of elements) {
       //console.log(element)
        const text = await element.innerText();
        //const regex = /(oneplus |5g|grey|256gb|8gb)/i; // Case insensitive regex
        const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        
    
        if (regex.test(text)) {
            console.log(text);
            console.log("it matches")
            let href = await page.evaluate(el => el.getAttribute('href'), element);
       // console.log("Match found, clicking the href:", href);
        href = urlToTest+href
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
       // expect(page.getByRole('heading', { name: `${test}` }).locator('#productTitle'))
        await page.locator('#desktop_qualifiedBuyBox').getByLabel('Add to Cart').click();
        await page.waitForLoadState('domcontentloaded');
        await page.getByLabel('Cart', { exact: true }).click();
        await page.waitForLoadState('domcontentloaded');
        //await page.getByLabel('items in cart').click();
        await page.waitForLoadState('domcontentloaded');
        const pageText = await page.textContent('body');

const containsText = pageText.includes(text);

if (containsText) {
    console.log(`The page contains the text: ${text}`);
} else {
    console.log(`The page does not contain the text: ${text}`);
}
        break; 
        }
        
    }
    
})

test('add 2 items in cart', async({page}) => {
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    //change if you want to add more items within the same page(max number 17)
    const items = 2;
    //adding first 2 items in car
    for(let i=1;i<=items;i++)
    {
        await page.locator(`#a-autoid-${i}-announce`).click();
    }

    //goto cart
    await page.getByLabel('items in cart').click();
    //check if the page has only two items
    expect(page.getByText('Subtotal (2 items)')).toBeVisible;


})
test ('remove 1 item', async({page}) => {
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');

    //change if you want to add more items within the same page(max number 17)
    const items = 2;
    const del = 1; // change the number if you want to delete more item, should be less than or equal to additional items
    //adding first 2 items in car
    
    for(let j=1;j<=items;j++)
    {
        await page.locator(`#a-autoid-${j}-announce`).click();
    }

    //goto cart
    await page.getByLabel('items in cart').click();

    //remove one item
    // for(let k=1;k<=del;k++)
    // {
    //     await page.locator(`#a-autoid-${k}-announce`).getByText('Qty:').click();
    //     await page.waitForLoadState('domcontentloaded');
    //     await page.getByRole('option', { name: '(Delete)' }).locator('#quantity_0').click();
    // }
    await page.locator('.a-dropdown-label').getByText('Qty:').nth(1).click();
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('option', { name: '(Delete)' }).locator('#quantity_0').click();

    //check if the cart has 1 item
    await page.waitForLoadState('domcontentloaded');
    expect(page.getByText('Subtotal (1 item)')).toBeVisible;

})


test('order an item/without signin', async({page}) => {
    //here we are ordering a 'one plus mobile' from the search result
    await page.goto(urlToTest);
    await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
  //  await expect(page.getByText('results for Oneplus nord ce 5g')).toBeVisible;

    //check if the results have Oneplus nord ce 5g 
    //I'm gonna order one plus nord ce 5g, grey, 128 gb

    const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    for (const element of elements) {
       //console.log(element)
        const text = await element.innerText();
        //const regex = /(oneplus |5g|grey|256gb|8gb)/i; // Case insensitive regex
        const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        
    
        if (regex.test(text)) {
            console.log(text);
            console.log("it matches")
            let href = await page.evaluate(el => el.getAttribute('href'), element);
        console.log("Match found, clicking the href:", href);
        href = urlToTest+href
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
        expect(page.getByRole('heading', { name: `${test}` }).locator('#productTitle'))
        await page.locator('#desktop_qualifiedBuyBox').getByLabel('Add to Cart').click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(10000);
        await page.getByRole('button',{ name:'Proceed to checkout (1 item)', exact: true}).click();
        expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
        await page.waitForTimeout(5000);
        break; 
        }
        
    }

    
})

//to go on for further process, we need amazon creds,since I don't have that, I have implemented a sample TC here

// test('order an item/with signin ', async({page}) => {
//     //here we are ordering a 'one plus mobile' from the search result
//     await page.goto(urlToTest);
//     await page.getByPlaceholder('Search Amazon.in').fill('Oneplus nord ce 5g');
//     await page.getByRole('button', { name: 'Go', exact: true }).click();
//     await page.waitForLoadState('domcontentloaded');

//     //check if the results have Oneplus nord ce 5g 
//     //I'm gonna order one plus nord ce 5g, grey, 128 gb

//     const elements = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
//     for (const element of elements) {
//        //console.log(element)
//         const text = await element.innerText();
//         //const regex = /(oneplus |5g|grey|256gb|8gb)/i; // Case insensitive regex
//         const regex = /(?=.*oneplus)(?=.*5g)(?=.*gray)(?=.*256gb)(?=.*8gb)/i
        
    
//         if (regex.test(text)) {
//             console.log(text);
//             console.log("it matches")
//             let href = await page.evaluate(el => el.getAttribute('href'), element);
//         console.log("Match found, clicking the href:", href);
//         href = urlToTest+href
//         await page.goto(href);
//         await page.waitForLoadState('domcontentloaded');
//         expect(page.getByRole('heading', { name: `${test}` }).locator('#productTitle'))
//         await page.locator('#desktop_qualifiedBuyBox').getByLabel('Add to Cart').click();
//         await page.waitForLoadState('domcontentloaded');
//         await page.waitForTimeout(10000);
//         await page.getByRole('button',{ name:'Proceed to checkout (1 item)', exact: true}).click();
//         expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
//         await page.getByLabel('Email or mobile phone number').fill('**********');
//         await page.getByLabel('Continue').click();
//         await page.getByLabel('Password').fill('**********');
//         await page.getByText('Sign in Keep me signed in.').click();
//         await page.getByLabel('Sign in').click();
//         await page.locator('#input-box-otp').fill('723604');
//         await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()
//         await page.getByLabel('Cash on Delivery/Pay on').check();
//         await page.waitForTimeout(5000);
//         break; 
//         }
        
//     }

// })

