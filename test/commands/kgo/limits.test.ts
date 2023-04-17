import {config as chaiConfig} from 'chai';
import {TestContext} from '@salesforce/core/lib/testSetup'; // , MockTestOrgData
import {stubSfCommandUx} from '@salesforce/sf-plugins-core';
import {stubMethod} from '@salesforce/ts-sinon';
import KgoLimits from '../../../src/commands/kgo/limits';
import defaultResult from './api_limits.json';
import limitedResult from './api_limits_ActiveScratchOrgs.json';

chaiConfig.truncateThreshold = 0;

describe('kgo limits', () => {
  // Create new TestContext, which automatically creates and restores stubs
  // pertaining to authorization, orgs, config files, etc...
  // There is no need to call $$.restore() in afterEach() since that is
  // done automatically by the TestContext.
  const $$ = new TestContext();

  beforeEach(async () => {
    // Stub the ux methods on SfCommand so that you don't get any command output in your tests.
    stubSfCommandUx($$.SANDBOX);
  });

  it('initial test full', async () => {
    stubMethod($$.SANDBOX, KgoLimits.prototype, 'getResult').returns(defaultResult);
    await KgoLimits.run(['-o', 'roeiugboirb']);
  });

  it('initial test full json', async () => {
    stubMethod($$.SANDBOX, KgoLimits.prototype, 'getResult').returns(defaultResult);
    await KgoLimits.run(['-o', 'roeiugboirb', '--json']);
  });

  it('test with sub list', async () => {
    stubMethod($$.SANDBOX, KgoLimits.prototype, 'getResult').returns(limitedResult);
    await KgoLimits.run(['-o', 'roeiugboirb', '-l', 'ActiveScratchOrgs']);
  });

  it('test with sub list json', async () => {
    stubMethod($$.SANDBOX, KgoLimits.prototype, 'getResult').returns(limitedResult);
    await KgoLimits.run(['-o', 'roeiugboirb', '-l', 'ActiveScratchOrgs', '--json']);
  });

  it('test with sub list debug', async () => {
    stubMethod($$.SANDBOX, KgoLimits.prototype, 'getResult').returns(limitedResult);
    await KgoLimits.run(['-o', 'roeiugboirb', '-l', 'ActiveScratchOrgs', '--json', '--debug']);
  });
});
