// import {readFileSync} from 'node:fs';
import { TestContext } from '@salesforce/core/testSetup';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { stubMethod } from '@salesforce/ts-sinon';
// import {XMLBuilder, XMLParser} from 'fast-xml-parser';
import KgoSourceRead from '../../../../src/commands/kgo/source/read.js';

describe('kgo source read', () => {
  const $$ = new TestContext();
  // const defaultAdmin2 = readFileSync('./test/commands/kgo/source/Admin2.profile-meta.xml', 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
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

  // it('fast xml tests', async () => {
  //   const optionsParse = {
  //     processEntities: false,
  //     format: true,
  //     ignoreAttributes: false,
  //     // preserveOrder: true,
  //     textNodeName: '_',
  //     // alwaysCreateTextNode: false,
  //   };
  //   const parser = new XMLParser(optionsParse);
  //   const defaultAdmin2 = readFileSync('./test/commands/kgo/source/Admin2.profile-meta.xml', 'utf8');
  //   console.log('defaultAdmin2', defaultAdmin2);
  //   const output = parser.parse(defaultAdmin2);
  //   console.log('output');
  //   console.dir(output, {depth: null});

  //   const optionsBuild = {
  //     processEntities: false,
  //     format: true,
  //     ignoreAttributes: false,
  //     // preserveOrder: true,
  //     textNodeName: '_',
  //     // alwaysCreateTextNode: false,
  //     indentBy: ' '.repeat(4),
  //   };
  //   const rebuilder = new XMLBuilder(optionsBuild);
  //   const xmlDataStr = rebuilder.build(output);
  //   console.log('xmlDataStr', xmlDataStr);
  //   // const testData = [] as unknown[];
  //   // const objInit = {'?xml': [{_: ''}],':@': {'@_version': '1.0', '@_encoding': 'UTF-8'}};
  //   // testData.push(objInit);

  //   console.log('before JSON.stringify(data)');
  //   data['@_xmlns'] = 'http://soap.sforce.com/2006/04/metadata';
  //   const jsonData = JSON.stringify(data);
  //   console.log('jsonData', jsonData);
  //   const strObj = '{"?xml": {"@_version": "1.0", "@_encoding": "UTF-8"},"' + 'Profile' + '":' + jsonData + '}';
  //   console.log('strObj', strObj);
  //   // testData.push(JSON.parse(strObj));
  //   console.log('before JSON.parse(strObj)');
  //   console.dir(JSON.parse(strObj), {depth: null});
  //   console.log('after JSON.parse(strObj)');
  //   const builder = new XMLBuilder(optionsBuild);
  //   const xmlDataStrObj = builder.build(JSON.parse(strObj));
  //   console.log(xmlDataStrObj);
  // })

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
        sourceApiVersion: '60.0',
      },
    });
    stubMethod($$.SANDBOX, KgoSourceRead.prototype, 'getResult').returns(data);
    await KgoSourceRead.run(['-m', 'Profile:Admin2', '-o', 'dummy']);
  });
});
