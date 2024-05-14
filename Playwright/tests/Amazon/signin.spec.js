// @ts-check
const { test, expect } = require('@playwright/test');
const urlToTest = 'https://www.amazon.in/';

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

function passwordChecker(password) {
    let regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{6,15}$/; 
    return regex.test(password);
}

test('signin in homepage works', async({page}) => {
    await page.goto(urlToTest);
    try{
        await expect(await page.getByRole('link', { name: 'Start here.' })).toBeVisible;
        await page.getByRole('link', { name: 'Start here.' }).click();
        console.log('signin in homepage redirects to respective page');
        await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible;
        await expect(page.getByText('Your name', { exact: true })).toBeVisible;
        await expect(page.getByText('Password', { exact: true })).toBeVisible;
        await expect(page.getByLabel('Verify mobile number')).toBeVisible();
        console.log('sigin page doesnt have necessary fields');
    } catch(error) {
        console.log('sigin page doesnt work');
    }
    
})
test ('submitting blank fields', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    await page.getByLabel('Verify mobile number').click();

    await expect(page.getByText('Enter your name')).toBeVisible;
    await expect(page.locator('#auth-phoneNumber-missing-alert').getByText('Enter your mobile number')).toBeVisible;
    await expect(page.getByText('Enter your password')).toBeVisible;
})

test('name with special chars', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    const randomString = generateRandomString(10,0);
    await page.getByPlaceholder('First and last name').fill(randomString);
    console.log(randomString);
    await page.getByPlaceholder('Mobile number').click();
    await page.getByPlaceholder('Mobile number').fill('8543613846');
    await page.getByPlaceholder('At least 6 characters').click();
    await page.getByPlaceholder('At least 6 characters').fill('kshfuhihgi');
    await page.getByLabel('Verify mobile number').click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('There is a slight problem with your request. Please make sure that you do not include the characters "$^" in your name.')).toBeVisible;
})

test('name with numbers', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    const randomString = generateRandomString(10,1);
    await page.getByPlaceholder('First and last name').fill(randomString);
    console.log(randomString);
    await page.getByPlaceholder('Mobile number').click();
    await page.getByPlaceholder('Mobile number').fill('8543613846');
    await page.getByPlaceholder('At least 6 characters').click();
    await page.getByPlaceholder('At least 6 characters').fill('kshfuhihgi');
    await page.getByLabel('Verify mobile number').click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('There is a slight problem with your request. Please make sure that you do not include the characters "$^" in your name.')).toBeVisible;
})
//amazon fails this test case as the name field allows more than 40 chars
test('name with >40 chars', async({page}) => {
    
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    await page.getByPlaceholder('First and last name').click();
    await page.getByPlaceholder('First and last name').fill('45hFcI8W6b0KLoRdrjLTvQkpIH2aVQYz0wUNqwvgbVjmfuuWc5');
    await page.getByPlaceholder('Mobile number').click();
    await page.getByPlaceholder('Mobile number').fill('8543613846');
    await page.getByPlaceholder('At least 6 characters').click();
    await page.getByPlaceholder('At least 6 characters').fill('kshfuhihgi');
    await page.getByLabel('Verify mobile number').click();
    await page.waitForLoadState('domcontentloaded');
    
    try {
        // @ts-ignore
        const messageElement = await page.waitForSelector('heading-selector', { text: 'There was a problem' }, { timeout: 5000 });
        const isVisible = await messageElement.isVisible();
        expect(isVisible).toBe(true);

      } catch (error) {
        throw new Error('The expected message /There was a problem/ is not displayed after clicking the button');
      }
})

//amazon fails this test case as the phone number field allows more than 10 digits
test('mobile number with >10', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    const randomString = generateRandomString(10,1);
    await page.getByPlaceholder('First and last name').fill(randomString);
   // console.log(randomString);
    await page.getByPlaceholder('Mobile number').click();
    await page.getByPlaceholder('Mobile number').fill('854361384609787877');
    await page.getByPlaceholder('At least 6 characters').click();
    await page.getByPlaceholder('At least 6 characters').fill('kshfuhihgi');
    await page.getByLabel('Verify mobile number').click();
    await page.waitForLoadState('domcontentloaded');

    try {
        // @ts-ignore
        const messageElement = await page.waitForSelector('heading-selector', { text: 'There was a problem' }, { timeout: 5000 });
        const isVisible = await messageElement.isVisible();
        expect(isVisible).toBe(true);

      } catch (error) {
        throw new Error('The expected message /There was a problem/ is not displayed after clicking the button');
      }
})

test('mobile number with <10', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    const randomString = generateRandomString(10,1);
    await page.getByPlaceholder('First and last name').fill(randomString);
    //console.log(randomString);
    await page.getByPlaceholder('Mobile number').click();
    await page.getByPlaceholder('Mobile number').fill('87877');
    await page.getByPlaceholder('At least 6 characters').click();
    await page.getByPlaceholder('At least 6 characters').fill('kshfuhihgi');
    await page.getByLabel('Verify mobile number').click();
    await page.waitForLoadState('domcontentloaded');

    try {
        // @ts-ignore
        const messageElement = await page.waitForSelector('heading-selector', { text: 'There was a problem' }, { timeout: 5000 });
        const isVisible = await messageElement.isVisible();
        expect(isVisible).toBe(true);

      } catch (error) {
        throw new Error('The expected message /There was a problem/ is not displayed after clicking the button');
      }
});

test('password <6', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    const randomString = generateRandomString(10,1);
    await page.getByPlaceholder('First and last name').fill(randomString);
    //console.log(randomString);
    await page.getByPlaceholder('Mobile number').click();
    await page.getByPlaceholder('Mobile number').fill('87877');
    await page.getByPlaceholder('At least 6 characters').click();
    await page.getByPlaceholder('At least 6 characters').fill('kshfuhihgi');
    await page.getByLabel('Verify mobile number').click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.locator('#auth-password-invalid-password-alert').getByText('Passwords must be at least 6')).toBeVisible;
});

//amazon doesn't have password standards
test('password strength', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    const randomString = generateRandomString(10,1);
    await page.getByPlaceholder('First and last name').fill(randomString);
    //console.log(randomString);
    await page.getByPlaceholder('Mobile number').click();
    await page.getByPlaceholder('Mobile number').fill('87877');
    await page.getByPlaceholder('At least 6 characters').click();
    const password = 'kshfuhihgi';
    if(passwordChecker(password))
    {
        console.log("Password matches the standard requirement")
    }
    else{console.log("password doesn't match standard requirements")}
    await page.getByPlaceholder('At least 6 characters').fill(password);
    await page.getByLabel('Verify mobile number').click();
    await page.waitForLoadState('domcontentloaded');

    try {
        // @ts-ignore
        const messageElement = await page.waitForSelector('heading-selector', { text: 'There was a problem' }, { timeout: 5000 });
        const isVisible = await messageElement.isVisible();
        expect(isVisible).toBe(true);

      } catch (error) {
        throw new Error('The expected message /There was a problem/ is not displayed after clicking the button');
      }
})

test('All fields are valid', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    const randomString = generateRandomString(10,1);
    await page.getByPlaceholder('First and last name').fill(randomString);
    //console.log(randomString);
    await page.getByPlaceholder('Mobile number').click();
    await page.getByPlaceholder('Mobile number').fill('8787798987');
    await page.getByPlaceholder('At least 6 characters').click();
    await page.getByPlaceholder('At least 6 characters').fill('kshfuhihgi');
    await page.getByLabel('Verify mobile number').click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.frameLocator('iframe[title="verification puzzle"]').getByRole('heading', { name: 'Solve this puzzle to protect' })).toBeVisible();
});

test('shop on business is working', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    try {
        await expect(page.getByRole('link', { name: 'Shop on Amazon Business' })).toBeVisible();
        await page.getByRole('link', { name: 'Shop on Amazon Business' }).click();
        await expect(page.getByLabel('Email or mobile phone number')).toBeVisible;
        await expect(page.getByLabel('Password')).toBeVisible;
        console.log('shp on business is working and taking to the respective link')
    } catch(erorr) {
        console.log('the shop on business link is not working')
    }
});

test('check conditions of use is available', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#legalTextRow').getByRole('link', { name: 'Conditions of Use' })).toBeVisible;
    
    await page.locator('#legalTextRow').getByRole('link', { name: 'Conditions of Use' }).click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Conditions of Use' })).toBeVisible();
});

test('check privacy notice is available', async({page}) => {
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Start here.' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible;
    
    await page.getByRole('link', { name: 'Privacy Policy' }).click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Amazon.in Privacy Notice' })).toBeVisible();

})