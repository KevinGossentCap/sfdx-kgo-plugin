import { SfCommand, Flags, Ux } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import {
  CodeCoverageResult,
  DeployMessage,
  DeployResult,
  FlowCoverageResult,
} from '@jsforce/jsforce-node/lib/api/metadata.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sfdx-kgo-plugin', 'kgo.deploy.listCoverage');

declare type KgoDeployListCoverageResultItem = {
  type: string;
  name: string;
  numLocations: number;
  numLocationsNotCovered: number;
  pctCoverage: number;
};

declare type KgoFlowCoverage = {
  deployed?: KgoDeployListCoverageResultItem[];
  others?: KgoDeployListCoverageResultItem[];
};

export type KgoDeployListCoverageResult = {
  codeCoverage?: KgoDeployListCoverageResultItem[];
  flowCoverage?: KgoFlowCoverage;
};

const tabColumns = {
  type: { header: 'type' },
  name: { header: 'name' },
  numLocations: { header: 'numLocations' },
  numLocationsNotCovered: { header: 'numLocationsNotCovered' },
  pctCoverage: { header: 'pctCoverage' },
};

const tableOptions: Ux.Table.Options = { sort: '-numLocationsNotCovered,-numLocations,name' };
const altTableOptions: Ux.Table.Options = { sort: 'pctCoverage,-numLocations,name' };

export default class KgoDeployListCoverage extends SfCommand<KgoDeployListCoverageResult> {
  public static readonly summary = messages.getMessage('summary');
  // public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['kgo:deploy:ListApexCoverage'];
  public static readonly hiddenAliases = ['kgo:deploy:ListApexCoverage'];
  public static readonly deprecateAliases = true;

  public static readonly flags = {
    'target-org': Flags.requiredOrg(),
    'job-id': Flags.salesforceId({
      summary: messages.getMessage('flags.job-id.summary'),
      char: 'i',
      required: true,
      length: 'both',
      startsWith: '0Af',
      aliases: ['jobid'],
      deprecateAliases: true,
    }),
    'sort-pct': Flags.boolean({
      summary: messages.getMessage('flags.sort-pct.summary'),
      char: 'p',
      aliases: ['sortpct'],
      deprecateAliases: true,
    }),
  };

  public async run(): Promise<KgoDeployListCoverageResult> {
    const { flags } = await this.parse(KgoDeployListCoverage);

    const result = await this.getResult();

    const output: KgoDeployListCoverageResult = {} as KgoDeployListCoverageResult;

    if (result?.details?.['runTestResult']) {
      this.log('ApexClass test Coverage');
      if (result?.details?.['runTestResult']?.['codeCoverage'].length > 0) {
        const reducer = (
          previousValue: KgoDeployListCoverageResultItem[],
          currentValue: CodeCoverageResult
        ): KgoDeployListCoverageResultItem[] => {
          const unitCov: KgoDeployListCoverageResultItem = {} as KgoDeployListCoverageResultItem;
          unitCov.type = currentValue.type;
          unitCov.name = currentValue.name;
          unitCov.numLocations = currentValue.numLocations;
          unitCov.numLocationsNotCovered = currentValue.numLocationsNotCovered;
          unitCov.pctCoverage = 100 - (100 * unitCov.numLocationsNotCovered) / unitCov.numLocations;

          previousValue.push(unitCov);
          return previousValue;
        };

        output.codeCoverage = result?.details?.['runTestResult']?.['codeCoverage'].reduce(reducer, []);

        this.table(output.codeCoverage, tabColumns, flags['sort-pct'] ? altTableOptions : tableOptions);
      } else {
        this.log('N/A');
      }

      this.log('\nFlow test Coverage');
      if (result?.details?.['runTestResult']?.['flowCoverage'].length > 0) {
        output.flowCoverage = {};

        const flowReducer = (previousValue: string[], currentValue: DeployMessage): string[] => {
          if (currentValue.componentType === 'Flow') {
            previousValue.push(currentValue.fullName);
          }
          return previousValue;
        };

        const lstDeployedFlows = result?.details?.['componentSuccesses']?.reduce(flowReducer, []);

        const reducer = (previousValue: KgoFlowCoverage, currentValue: FlowCoverageResult): KgoFlowCoverage => {
          const unitCov: KgoDeployListCoverageResultItem = {} as KgoDeployListCoverageResultItem;
          unitCov.type = currentValue.processType;
          unitCov.name = currentValue.flowName;
          unitCov.numLocations = currentValue.numElements;
          unitCov.numLocationsNotCovered = currentValue.numElementsNotCovered;
          unitCov.pctCoverage = 100 - (100 * unitCov.numLocationsNotCovered) / unitCov.numLocations;

          if (lstDeployedFlows.includes(currentValue.flowName)) {
            if (!previousValue.deployed) {
              previousValue.deployed = [];
            }
            previousValue.deployed.push(unitCov);
          } else {
            if (!previousValue.others) {
              previousValue.others = [];
            }
            previousValue.others.push(unitCov);
          }
          return previousValue;
        };

        output.flowCoverage = result?.details?.['runTestResult']?.['flowCoverage'].reduce(reducer, output.flowCoverage);

        if (output.flowCoverage.deployed) {
          this.log('Deployed Flows');
          this.table(output.flowCoverage.deployed, tabColumns, altTableOptions);
        }
        if (output.flowCoverage.others) {
          this.log('Existing and not deployed Flows');
          this.table(output.flowCoverage.others, tabColumns, altTableOptions);
        }
      } else {
        this.log('N/A');
      }
    }
    return output;
  }

  protected async getResult(): Promise<DeployResult> {
    const { flags } = await this.parse(KgoDeployListCoverage);
    return flags['target-org'].getConnection(undefined).metadata.checkDeployStatus(flags['job-id'], true);
  }
}
