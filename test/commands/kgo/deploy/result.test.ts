import { createRequire } from 'node:module';
import { TestContext } from '@salesforce/core/lib/testSetup.js';
// import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { stubMethod } from '@salesforce/ts-sinon';
import KgoDeployResult from '../../../../src/commands/kgo/deploy/result.js';

describe('kgo deploy result', () => {
  const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;
  const require = createRequire(import.meta.url);
  const compError = require('./deploy_result_comp_error.json') as string;
  const classError = require('./deploy_result_testclass_error.json') as string;

  beforeEach(() => {
    // sfCommandStubs = stubSfCommandUx($$.SANDBOX);
    stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('test comp deploy error', async () => {
    stubMethod($$.SANDBOX, KgoDeployResult.prototype, 'getResult').returns(compError);
    await KgoDeployResult.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG']);
  });

  it('test apexclass error', async () => {
    stubMethod($$.SANDBOX, KgoDeployResult.prototype, 'getResult').returns(classError);
    await KgoDeployResult.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG']);
  });

  it('test comp deploy error json', async () => {
    stubMethod($$.SANDBOX, KgoDeployResult.prototype, 'getResult').returns(compError);
    await KgoDeployResult.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG', '--json']);
  });

  it('test apexclass error json', async () => {
    stubMethod($$.SANDBOX, KgoDeployResult.prototype, 'getResult').returns(classError);
    await KgoDeployResult.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG', '--json']);
  });
});
