import { createRequire } from 'node:module';
import { TestContext } from '@salesforce/core/testSetup';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { stubMethod } from '@salesforce/ts-sinon';
import KgoDeployListCoverage from '../../../../src/commands/kgo/deploy/listCoverage.js';

describe('kgo deploy listCoverage', () => {
  const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;
  const require = createRequire(import.meta.url);
  const defaultResult = require('./initial_deploy_result.json') as string;
  const emptyResult = require('./initial_deploy_result.json') as string;

  beforeEach(() => {
    // sfCommandStubs = stubSfCommandUx($$.SANDBOX);
    stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('initial test', async () => {
    stubMethod($$.SANDBOX, KgoDeployListCoverage.prototype, 'getResult').returns(defaultResult);
    await KgoDeployListCoverage.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG']);
  });

  it('initial test json', async () => {
    stubMethod($$.SANDBOX, KgoDeployListCoverage.prototype, 'getResult').returns(defaultResult);
    await KgoDeployListCoverage.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG', '--json']);
  });

  it('initial test visual alt', async () => {
    stubMethod($$.SANDBOX, KgoDeployListCoverage.prototype, 'getResult').returns(defaultResult);
    await KgoDeployListCoverage.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG', '-p']);
  });

  it('test empty with N/A json', async () => {
    stubMethod($$.SANDBOX, KgoDeployListCoverage.prototype, 'getResult').returns(emptyResult);
    await KgoDeployListCoverage.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG', '--json']);
  });

  it('test empty visual alt with N/A json', async () => {
    stubMethod($$.SANDBOX, KgoDeployListCoverage.prototype, 'getResult').returns(emptyResult);
    await KgoDeployListCoverage.run(['-o', 'roeiugboirb', '-i', '0Af1l000022QZubCAG', '-p', '--json']);
  });
});
