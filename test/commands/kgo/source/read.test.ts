import { TestContext } from '@salesforce/core/testSetup';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { stubMethod } from '@salesforce/ts-sinon';
import KgoSourceRead from '../../../../src/commands/kgo/source/read.js';

describe('kgo source read', () => {
  const $$ = new TestContext();
  // const defaultAdmin2 = readFileSync('./test/commands/kgo/source/Admin2.profile-meta.xml', 'utf8');
  const data = {
    applicationVisibilities: [
      {
        application: 'temp',
        default: false,
        visible: false,
      },
    ],
    custom: false,
    userLicense: 'Salesforce',
    userPermissions: [
      {
        enabled: true,
        name: 'ViewSetup',
      },
    ],
  };

  beforeEach(() => {
    // sfCommandStubs = stubSfCommandUx($$.SANDBOX);
    stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('initial test full', async () => {
    $$.setConfigStubContents('SfProjectJson', {
      contents: {
        packageDirectories: [
          {
            path: 'force-app',
            default: true,
          },
        ],
        namespace: '',
        sfdcLoginUrl: 'https://login.salesforce.com',
        sourceApiVersion: '59.0',
      },
    });
    stubMethod($$.SANDBOX, KgoSourceRead.prototype, 'getResult').returns(data);
    await KgoSourceRead.run(['-m', 'Profile:Admin2', '-o', 'dummy']);
  });
});
