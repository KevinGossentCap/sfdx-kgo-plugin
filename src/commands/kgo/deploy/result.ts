import {SfdxCommand, flags, FlagsConfig, SfdxResult} from '@salesforce/command'
import {Messages} from '@salesforce/core'
import {AnyJson} from '@salesforce/ts-types'
declare var __dirname;

Messages.importMessagesDirectory(__dirname);
const messages: Messages = Messages.loadMessages('sfdx-kgo-plugin', 'mdapi_deploy');

export default class KgoDeployResult extends SfdxCommand {
  static description = 'fast get deploy result, statistics and error list'

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false

  protected static tableColumnData = ['index', 'name', 'methodName', 'stackTrace', 'message'];

  public static result: SfdxResult = {
    display() {
      this.ux.log('Status', this.data?.['status'])
      this.ux.log('Component Failures', this.data?.['numberComponentErrors'])
      this.ux.log('Apex testClass Failures', this.data?.['numberTestErrors'])
      this.ux.log('ApexClass test Coverage', this.data?.['codeCoverage'])
      this.ux.log('Flow test Coverage', this.data?.['flowCoverage'])
      if (this.data?.['numberComponentErrors'] > 0) {
        this.ux.table(this.data?.['componentFailures'] as unknown as any[], {
          columns: [
            {key: 'componentType'},
            {key: 'problemType'},
            {key: 'fullName'},
            {key: 'fileName'},
            {key: 'problem'}
          ],
        })
      }
      if (this.data?.['numberTestErrors'] > 0) {
        this.ux.table(this.data?.['apexFailures'] as unknown as any[], {
          columns: [
            {key: 'index'},
            {key: 'name'},
            {key: 'methodName'},
            {key: 'stackTrace'},
            {key: 'message'}
          ],
        })
      }
    }
  }

  protected static flagsConfig: FlagsConfig = {
    jobid: flags.id({
      char: 'i',
      description: messages.getMessage('mdDeployCommandCliJobId'),
      longDescription: messages.getMessage('mdDeployCommandCliJobIdLong'),
      required: true
    })
  }

  public async run(): Promise<AnyJson> {
    const conn = this.org.getConnection()
    let result = await conn.metadata.checkDeployStatus(this.flags.jobid, true)
    // this.ux.styledJSON(result)
    let output: AnyJson = {}
    output.status = result.status
    output.numberComponentErrors = result.numberComponentErrors
    if (output.numberComponentErrors > 0) {
      output.componentFailures = []
      output.componentFailures.push(result?.details?.['componentFailures'])
    }
    
    output.numberTestErrors = result.numberTestErrors
    if (output.numberTestErrors > 0) {
      output.apexFailures = []
      output.apexFailures.push(result?.details?.['runTestResult']?.['failures']);
      for (let index = 0; index < Object.keys(output.apexFailures).length; index++) {
        output.apexFailures[index]["index"] = index + 1
      }
      // output.apexFailures = (Array<AnyJson>(output.apexFailures)).map((elem, ind) => {
      //   elem["index"] = ind + 1
      //   return elem
      // })
    }
    
    if (result?.details?.['runTestResult']?.['codeCoverage']) {
      const reducer = (previousValue, currentValue) => {
        previousValue.numLocations += parseInt(currentValue.numLocations)
        previousValue.numLocationsNotCovered += parseInt(currentValue.numLocationsNotCovered)
        return previousValue
      }
      
      let reduced = result?.details?.['runTestResult']?.['codeCoverage'].reduce(reducer,{numLocations: 0, numLocationsNotCovered: 0})
      
      output.codeCoverage = (100-100*reduced.numLocationsNotCovered/reduced.numLocations)
    } else {
      output.codeCoverage = 'N/A'
    }
    
    if (result?.details?.['runTestResult']?.['flowCoverage']) {
      const reducer = (previousValue, currentValue) => {
        previousValue.numFlow += 1
        if (currentValue.numElements != currentValue.numElementsNotCovered) {
          previousValue.numFlowCovered += 1
        }
        return previousValue
      }
      
      let reduced = result?.details?.['runTestResult']?.['flowCoverage'].reduce(reducer,{numFlow: 0, numFlowCovered: 0})
      
      output.flowCoverage = (100*reduced.numFlowCovered/reduced.numFlow)
    } else {
      output.flowCoverage = 'N/A'
    }
    
    return output
  }
}
