import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { OrganizationLimitsInfo } from '@jsforce/jsforce-node';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sfdx-kgo-plugin', 'kgo.limits');

export type KgoLimitsResult = {
  name: string;
  rate: string;
  max: number;
  left: number;
};

const limitsColumns = {
  name: { header: 'Name' },
  rate: { header: 'Percent used' },
  max: { header: 'Max usable' },
  left: { header: 'Remaining' },
};

export default class KgoLimits extends SfCommand<KgoLimitsResult[]> {
  public static readonly summary = messages.getMessage('summary');
  // public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'target-org': Flags.requiredOrg(),
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

  public async run(): Promise<KgoLimitsResult[]> {
    const { flags } = await this.parse(KgoLimits);

    const apiLimits = await this.getResult();

    if (flags.debug) this.logJson(apiLimits);

    if (!flags.limits) {
      flags.limits = Object.keys(apiLimits);
    }

    const output = [] as KgoLimitsResult[];

    for (const iterator of flags.limits) {
      const elem = {} as KgoLimitsResult;
      elem.name = iterator;
      elem.max = apiLimits[iterator].Max;
      elem.left = apiLimits[iterator].Remaining;
      elem.rate = ((100 * (elem.max - elem.left)) / elem.max).toFixed(2) + ' %';
      output.push(elem);
    }

    if (!flags.json) {
      this.table(output, limitsColumns);
    }

    return output;
  }

  protected async getResult(): Promise<OrganizationLimitsInfo> {
    const { flags } = await this.parse(KgoLimits);
    return flags['target-org'].getConnection(undefined).limits();
  }
}
