import { test, expect, Page } from '@playwright/test';
        import { testBehaviour } from '@hummus/runner';
test('Authentication > User with invalid credentials cannot log in', async ({page}) => {
      await test.step('1. I am on "login page"', async () => {
        await testBehaviour('I am on <location>', [{"id":1,"name":"login page","value":"/","type":"location","featureId":"seed-feature-id"}], page);
      });
await test.step('2. I fill the "username field" with "my username"', async () => {
        await testBehaviour('I fill the <selector> with <text>', [{"id":2,"name":"username field","value":"[data-test=\"username-field\"]","type":"selector","featureId":"seed-feature-id"},{"id":3,"name":"my username","value":"testuser","type":"text","featureId":"seed-feature-id"}], page);
      });
await test.step('3. I fill the "password field" with "my password"', async () => {
        await testBehaviour('I fill the <selector> with <text>', [{"id":4,"name":"password field","value":"[data-test=\"password-field\"]","type":"selector","featureId":"seed-feature-id"},{"id":5,"name":"my password","value":"mypassword","type":"text","featureId":"seed-feature-id"}], page);
      });
await test.step('4. I click on "login button"', async () => {
        await testBehaviour('I click on <selector>', [{"id":6,"name":"login button","value":"[data-test=\"login-button\"]","type":"selector","featureId":"seed-feature-id"}], page);
      });
    });