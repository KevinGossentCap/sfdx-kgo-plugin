/* eslint-disable sf-plugin/no-missing-messages */
import {SfCommand, Flags} from '@salesforce/sf-plugins-core';
import {Messages} from '@salesforce/core';
// import {DeployResult, DeployMessage, RunTestFailure} from 'jsforce/api/metadata';
// import {LimitInfo} from 'jsforce'
import {Interfaces} from '@oclif/core';
import {OrganizationLimitsInfo} from 'jsforce/lib';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdx-kgo-plugin', 'kgo.limits');

// export type KgoLimitsResult = {
//   path: string;
// };

declare type KgoLimitsResultElem = {
  name: string;
  rate: string;
  max: number;
  left: number;
}

declare type KgoLimitsResult = KgoLimitsResultElem[];

const limitsColumns = {
  name: {header: 'Name'},
  rate: {header: 'Percent used'},
  max: {header: 'Max usable'},
  left: {header: 'Remaining'},
};

export default class KgoLimits extends SfCommand<KgoLimitsResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'target-org': Flags.requiredOrg({
      summary: messages.getMessage('flags.target-org.summary'),
      char: 'o',
      required: true,
      aliases: ['targetusername', 'u'],
      deprecateAliases: true,
    }),
    limits: Flags.string({
      summary: messages.getMessage('flags.limits.summary'),
      char: 'l',
      multiple: true,
      delimiter: ',',
    }),
    debug: Flags.boolean({
      summary: messages.getMessage('flags.debug.summary'),
      hidden: true,
    }),
  };
  private flags: Interfaces.InferredFlags<typeof KgoLimits.flags>;

  public async run(): Promise<KgoLimitsResult> {
    this.flags = (await this.parse(KgoLimits)).flags;

    const apiLimits = await this.getResult();

    if (this.flags.debug) this.logJson(apiLimits)

    if (!this.flags.limits) {
      this.flags.limits = Object.keys(apiLimits)
    }

    const output: KgoLimitsResult = [] as KgoLimitsResultElem[];

    for (const iterator of this.flags.limits) {
      const elem: KgoLimitsResultElem = {} as KgoLimitsResultElem;
      elem.name = iterator
      elem.max = apiLimits[iterator].Max
      elem.left = apiLimits[iterator].Remaining
      elem.rate = (100 * (elem.max - elem.left) / elem.max).toFixed(2) + ' %'
      output.push(elem)
    }

    if (!this.flags.json) {
      this.table(output, limitsColumns)
    }

    return output

    // const name = this.flags.name ?? 'world';
    // this.log(`hello ${name} from C:\\GitRepos\\sfdx-kgo-plugin-2\\sfdx-kgo-plugin\\src\\commands\\kgo\\limits.ts`);
    // return {
    //   path: 'C:\\GitRepos\\sfdx-kgo-plugin-2\\sfdx-kgo-plugin\\src\\commands\\kgo\\limits.ts',
    // };
  }

  protected async getResult(): Promise<OrganizationLimitsInfo> {
    // Get the connection to the org
    // const result = await this.flags['target-org']
    //   .getConnection(undefined)
    //   .limits();

    // return result;
    return this.flags['target-org']
      .getConnection(undefined)
      .limits();
  }
}
