import { createRequire } from 'node:module';
import { TestContext } from '@salesforce/core/lib/testSetup.js';
// import {expect} from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { stubMethod } from '@salesforce/ts-sinon';
import KgoLimits from '../../../src/commands/kgo/limits.js';

describe('kgo limits', () => {
  const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;
  const require = createRequire(import.meta.url);
  const defaultResult = require('./api_limits.json') as string;
  const limitedResult = require('./api_limits_ActiveScratchOrgs.json') as string;

  beforeEach(() => {
    // sfCommandStubs = stubSfCommandUx($$.SANDBOX);
    stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
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
