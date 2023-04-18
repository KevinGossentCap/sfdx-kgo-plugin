import {config as chaiConfig} from 'chai';
import {TestContext} from '@salesforce/core/lib/testSetup'; // , MockTestOrgData
// import {AuthInfo} from '@salesforce/core';// , Org
import {stubSfCommandUx} from '@salesforce/sf-plugins-core';
import {stubMethod} from '@salesforce/ts-sinon';
import KgoDeployListCoverage from '../../../../src/commands/kgo/deploy/listCoverage';
import defaultResult from './initial_deploy_result.json';
import emptyResult from './initial_deploy_result copy.json';

chaiConfig.truncateThreshold = 0;

describe('kgo deploy listCoverage', () => {
  // Create new TestContext, which automatically creates and restores stubs
  // pertaining to authorization, orgs, config files, etc...
  // There is no need to call $$.restore() in afterEach() since that is
  // done automatically by the TestContext.
  const $$ = new TestContext();

  // let conn = new MockTestOrgData();

  beforeEach(async () => {
    // Stub the ux methods on SfCommand so that you don't get any command output in your tests.
    stubSfCommandUx($$.SANDBOX);
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
