// Generated from: e2e\features\smoke.feature
import { test } from "playwright-bdd";

test.describe('Smoke-test', () => {

  test('Startsidan går att öppna', async ({ Given, Then, page }) => { 
    await Given('att jag öppnar startsidan', null, { page }); 
    await Then('ska jag se en rubrik på nivå 1 på sidan', null, { page }); 
  });

  test('API:et svarar via proxyn', async ({ Given, Then, page }) => { 
    await Given('att jag öppnar "/api/hello" i webbläsaren', null, { page }); 
    await Then('ska jag se texten "Hello from .NET!"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\features\\smoke.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given att jag öppnar startsidan","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then ska jag se en rubrik på nivå 1 på sidan","stepMatchArguments":[{"group":{"start":29,"value":"1","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":11,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given att jag öppnar \"/api/hello\" i webbläsaren","stepMatchArguments":[{"group":{"start":15,"value":"\"/api/hello\"","children":[{"start":16,"value":"/api/hello","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then ska jag se texten \"Hello from .NET!\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Hello from .NET!\"","children":[{"start":19,"value":"Hello from .NET!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end