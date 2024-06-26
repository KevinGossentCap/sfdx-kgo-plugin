import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { DeployMessage, DeployResult, RunTestFailure } from '@jsforce/jsforce-node/lib/api/metadata.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sfdx-kgo-plugin', 'kgo.deploy.result');

declare type myIndexed = {
  index?: number;
};

declare type myApexFailures = myIndexed & RunTestFailure;

export type KgoDeployResultResult = {
  status: string;
  numberComponentErrors: number;
  numberTestErrors: number;
  codeCoverage: number;
  flowCoverage: number;
  componentFailures: DeployMessage[];
  apexFailures: myApexFailures[];
};

const compColumns = {
  componentType: { header: 'componentType' },
  problemType: { header: 'problemType' },
  fullName: { header: 'fullName' },
  fileName: { header: 'fileName' },
  problem: { header: 'problem' },
};

const apexColumns = {
  index: { header: 'index' },
  name: { header: 'name' },
  methodName: { header: 'methodName' },
  stackTrace: { header: 'stackTrace' },
  message: { header: 'message' },
};

export default class KgoDeployResult extends SfCommand<KgoDeployResultResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

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
  };

  public async run(): Promise<KgoDeployResultResult> {
    const { flags } = await this.parse(KgoDeployResult);

    const result = await this.getResult();

    const output: KgoDeployResultResult = {} as KgoDeployResultResult;
    output.status = result.status;
    output.numberComponentErrors = result.numberComponentErrors;
    output.numberTestErrors = result.numberTestErrors;
    output.componentFailures = result.details.componentFailures;
    if (result.details.runTestResult) {
      output.apexFailures = result.details.runTestResult.failures;

      output.apexFailures.map((value, ind) => {
        value.index = ind;
        return value;
      });

      const apexcov = result.details.runTestResult.codeCoverage.reduce(
        (previousValue, currentValue) => {
          previousValue.numLocations += currentValue.numLocations;
          previousValue.numLocationsNotCovered += currentValue.numLocationsNotCovered;
          return previousValue;
        },
        { numLocations: 0, numLocationsNotCovered: 0 }
      );
      output.codeCoverage = 100 - (100 * apexcov.numLocationsNotCovered) / apexcov.numLocations;

      const flowcov = result.details.runTestResult.flowCoverage.reduce(
        (previousValue, currentValue) => {
          previousValue.numFlow += 1;
          if (currentValue.numElements !== currentValue.numElementsNotCovered) {
            previousValue.numFlowCovered += 1;
          }
          return previousValue;
        },
        { numFlow: 0, numFlowCovered: 0 }
      );
      output.flowCoverage = (100 * flowcov.numFlowCovered) / flowcov.numFlow;
    }

    if (!flags.json) {
      this.log('Status', output.status);
      this.log('Component Failures', output.numberComponentErrors);
      this.log('Apex testClass Failures', output.numberTestErrors);
      this.log('ApexClass test Coverage', output.codeCoverage);
      this.log('Flow test Coverage', output.flowCoverage);
      if (output.componentFailures.length > 0) {
        this.table(output.componentFailures, compColumns, { 'no-truncate': true });
      }
      if (output.apexFailures.length > 0) {
        this.table(output.apexFailures, apexColumns, { 'no-truncate': true });
      }
    }
    return output;
  }

  protected async getResult(): Promise<DeployResult> {
    const { flags } = await this.parse(KgoDeployResult);
    return flags['target-org'].getConnection(undefined).metadata.checkDeployStatus(flags['job-id'], true);
  }
}
