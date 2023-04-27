import { test, expect, Page } from '@playwright/test';
import { testBehaviour } from '@hummus/runner';

test('Seed feature > User can log in', async ({page}) => {
  
  await test.step('1. I am on "login page"', async () => {
    
    await testBehaviour('I am on <location>', [{"name":"login page","value":"/login","type":"location"}], page);
    
  });
    

  await test.step('2. I fill the "username field" with "my username"', async () => {
    
    await testBehaviour('I fill the <selector> with <text>', [{"name":"username field","value":"[data-test=\"username-field\"]","type":"selector"},{"name":"my username","value":"testuser","type":"text"}], page);
    
  });
    

  await test.step('3. I fill the "password field" with "my password"', async () => {
    
    await testBehaviour('I fill the <selector> with <text>', [{"name":"password field","value":"[data-test=\"password-field\"]","type":"selector"},{"name":"my password","value":"mypassword","type":"text"}], page);
    
  });
    

  await test.step('4. I click on "login button"', async () => {
    
    await testBehaviour('I click on <selector>', [{"name":"login button","value":"[data-test=\"login-button\"]","type":"selector"}], page);
    
  });
    

  await test.step('5. I should be directed to "projects page"', async () => {
    
    await testBehaviour('I should be directed to <location>', [{"name":"projects page","value":"/projects","type":"location"}], page);
    
  });
    
});
    

test('Seed feature > User can log in with combined step', async ({page}) => {
  
  await test.step('1. I am logged in as user', async () => {
    
    await testBehaviour('I am on <location>', [{"name":"login page","value":"/login","type":"location"}], page);
    

    await testBehaviour('I fill the <selector> with <text>', [{"name":"username field","value":"[data-test=\"username-field\"]","type":"selector"},{"name":"my username","value":"testuser","type":"text"}], page);
    

    await testBehaviour('I fill the <selector> with <text>', [{"name":"password field","value":"[data-test=\"password-field\"]","type":"selector"},{"name":"my password","value":"mypassword","type":"text"}], page);
    

    await testBehaviour('I click on <selector>', [{"name":"login button","value":"[data-test=\"login-button\"]","type":"selector"}], page);
    

    await testBehaviour('I should be directed to <location>', [{"name":"projects page","value":"/projects","type":"location"}], page);
    
  });
    
});
    