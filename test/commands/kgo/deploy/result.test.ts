import {config as chaiConfig} from 'chai';
import {TestContext} from '@salesforce/core/lib/testSetup';
import {stubSfCommandUx} from '@salesforce/sf-plugins-core';
import {stubMethod} from '@salesforce/ts-sinon';
import KgoDeployResult from '../../../../src/commands/kgo/deploy/result';
import compError from './deploy_result_comp_error.json';
import classError from './deploy_result_testclass_error.json';

chaiConfig.truncateThreshold = 0;

describe('kgo deploy result', () => {
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
