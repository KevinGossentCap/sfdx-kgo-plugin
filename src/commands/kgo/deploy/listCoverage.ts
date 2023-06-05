import { SfCommand, Flags, Ux } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { CodeCoverageResult, FlowCoverageResult, DeployMessage, DeployResult } from 'jsforce/api/metadata';
import { Interfaces } from '@oclif/core';

Messages.importMessagesDirectory(__dirname);
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

declare type KgoDeployListCoverageResult = {
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
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['kgo:deploy:ListApexCoverage'];

  public static readonly flags = {
    'target-org': Flags.requiredOrg({
      summary: messages.getMessage('flags.target-org.summary'),
      char: 'o',
      required: true,
      aliases: ['targetusername', 'u'],
      deprecateAliases: true,
    }),
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
  private flags!: Interfaces.InferredFlags<typeof KgoDeployListCoverage.flags>;

  public async run(): Promise<KgoDeployListCoverageResult> {
    this.flags = (await this.parse(KgoDeployListCoverage)).flags;

    // Get the connection to the org
    // eslint-disable-next-line sf-plugin/get-connection-with-version
    // const conn = this.flags['target-org'].getConnection(undefined);
    // this.logJson(conn)
    // this.logJson(conn.metadata)

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

        this.table(output.codeCoverage, tabColumns, this.flags['sort-pct'] ? altTableOptions : tableOptions);
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
    // Get the connection to the org
    // eslint-disable-next-line sf-plugin/get-connection-with-version
    // const conn = this.flags['target-org'].getConnection(undefined);
    // this.logJson(conn)
    // this.logJson(conn.metadata)

    // const result = await this.flags['target-org']
    //   .getConnection(undefined)
    //   .metadata.checkDeployStatus(this.flags['job-id'], true);

    // return result;
    return this.flags['target-org'].getConnection(undefined).metadata.checkDeployStatus(this.flags['job-id'], true);
  }
}
