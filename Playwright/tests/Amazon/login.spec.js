// @ts-check
const { test, expect } = require('@playwright/test');
const urlToTest = 'https://www.amazon.in/';


test('If sign-in button is there', async ({page}) => {
    //check if the sign-in button is present
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await expect(page.url()).toContain('signin');
});

test('email is invalid', async({page}) => {
    //test with invalid email
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();
    await page.getByLabel('Email or mobile phone number').fill('amuthangmail.com');
    await page.getByLabel('Continue').click();

    await page.waitForLoadState('domcontentloaded');
    const pageContent = await page.content();
    const errorMessageExists = pageContent.includes('We cannot find an account with that email address');
    expect(errorMessageExists).toBeTruthy();
})
test('email is blank', async({page}) => {
    //when email field is blank
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();
    await page.getByLabel('Email or mobile phone number').fill('     ');
    await page.getByLabel('Continue').click();

    await page.waitForLoadState('domcontentloaded');
    const pageContent = await page.content();
    const errorMessageExists = pageContent.includes('Enter your email or mobile phone number');
    expect(errorMessageExists).toBeTruthy();
})
test('email value exceeds 40 chars', async({page}) => {
    //when the email value exceeds 40 chars
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();
    await page.getByLabel('Email or mobile phone number').fill('amjhgsetudgnvhwujkdlsbxgetulajsksnhetshanvdgh');
    await page.getByLabel('Continue').click();

    await page.waitForLoadState('domcontentloaded');
    const pageContent = await page.content();
    const errorMessageExists = pageContent.includes('We cannot find an account with that email address');
    expect(errorMessageExists).toBeTruthy();
})

test('email is valid', async({page}) => {
    //when the email is valid
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();
    await page.getByLabel('Email or mobile phone number').fill('amuthan@gmail.com');
    await page.getByLabel('Continue').click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByLabel('Password')).toBeVisible();
})

test('password is invalid', async({page}) => {
    //when the password is invalid
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();
    await page.getByLabel('Email or mobile phone number').fill('amuthan@gmail.com');
    await page.getByLabel('Continue').click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByLabel('Password')).toBeVisible();
    await page.getByLabel('Password').fill('password1');
    await page.getByLabel('Sign in').click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Your password is incorrect')).toBeVisible();

})

test('Forgot password', async({page}) => {
    //check the forgot password feature
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();
    await page.getByLabel('Email or mobile phone number').fill('amuthan@gmail.com');
    await page.getByLabel('Continue').click();

    await page.getByRole('link', { name: 'Forgot Password' }).click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Password assistance' })).toBeVisible();
    
    const textboxLocator = page.getByLabel('Email or mobile phone number');
    const textboxValue = await textboxLocator.inputValue();
    await expect(textboxValue).toBe('amuthan@gmail.com');

    await page.getByLabel('Continue').click();

    //if the email is not present in the DB
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('We can\'t seem to identify you')).toBeVisible;

    //enter the zipcode and verify the erorr message
    await page.getByLabel('ZIP code (or Postal Code)').click();
    await page.getByLabel('ZIP code (or Postal Code)').fill('625007');
    await page.getByLabel('Continue').click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('We\'re sorry. We weren\'t able')).toBeVisible;
});

test('check conditions of use is available', async({page}) => {
    //in sign-in email page
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();
  
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#legalTextRow').getByRole('link', { name: 'Conditions of Use' })).toBeVisible;
    
    await page.locator('#legalTextRow').getByRole('link', { name: 'Conditions of Use' }).click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Conditions of Use' })).toBeVisible();
})

test('check privacy notice is available', async({page}) => {
    //in sign-in email page
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();
  
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#legalTextRow').getByRole('link', { name: 'Privacy Notice' })).toBeVisible;
    
    await page.locator('#legalTextRow').getByRole('link', { name: 'Privacy Notice' }).click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Amazon.in Privacy Notice' })).toBeVisible();
})

test('need help functionality', async({page}) => {
    //check the need help functionality feature
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();

    await page.getByRole('button', { name: 'Need help?' }).click();
   
    await page.waitForLoadState('domcontentloaded');
    try {
        await expect(page.getByRole('link', { name: 'Forgot Password' })).toBeVisible();
        console.log('The "Forgot Password" link is visible.');
        await page.getByRole('link', { name: 'Forgot Password' }).click()
        await expect(page.getByRole('heading', { name: 'Password assistance' })).toBeVisible();
      } catch (error) {
        console.error('The "Forgot Password" link is not visible.');
      }
      try {
        await expect(page.getByRole('link', { name: 'Other issues with Sign-In' })).toBeVisible();
        console.log('The "Other issues with Sign-In" link is visible.');
        await page.getByRole('link', { name: 'Other issues with Sign-In' }).click()
        await expect(page.getByRole('heading', { name: 'Account & Login Issues' })).toBeVisible();
      } catch (error) {
        console.error('The "Other issues with Sign-In" link is not visible.');
      }
  

})

test('shop on business is working', async({page}) => {
    //check the shop on busines feature is working
    await page.goto(urlToTest);
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByLabel('Email or mobile phone number').click();

    try {
        await expect(page.getByRole('link', { name: 'Shop on Amazon Business' })).toBeVisible();
        await page.getByRole('link', { name: 'Shop on Amazon Business' }).click();
        await expect(page.getByLabel('Email or mobile phone number')).toBeVisible;
        await expect(page.getByLabel('Password')).toBeVisible;
        console.log('shp on business is working and taking to the respective link')
    } catch(erorr) {
        console.log('the shop on business link is not working')
    }
})
