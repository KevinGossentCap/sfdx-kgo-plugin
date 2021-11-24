import {SfdxCommand, flags, FlagsConfig, SfdxResult} from '@salesforce/command'
import {Messages} from '@salesforce/core'
import {AnyJson} from '@salesforce/ts-types'

Messages.importMessagesDirectory(__dirname);
const messages: Messages = Messages.loadMessages('sfdx-kgo-plugin', 'mdapi_deploy');

export default class KgoDeployListApexCoverage extends SfdxCommand {
  static description = 'fast get deploy coverage details'

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false
  
  public static result: SfdxResult = {
    display() {
      this.ux.table(this.data?.['codeCoverage'] as unknown as any[], {
        columns: [
          {key: 'type'},
          {key: 'name'},
          {key: 'numLocations'},
          {key: 'numLocationsNotCovered'},
          {key: 'pctCoverage'}
        ],
      })
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
    if (result?.details?.['runTestResult']?.['codeCoverage']) {
      const reducer = (previousValue, currentValue) => {
        let unitCov: AnyJson = {}
        unitCov.type = currentValue.type
        unitCov.name = currentValue.name
        unitCov.numLocations = parseInt(currentValue.numLocations)
        unitCov.numLocationsNotCovered = parseInt(currentValue.numLocationsNotCovered)
        unitCov.pctCoverage = (100-100*unitCov.numLocationsNotCovered/unitCov.numLocations)
        
        previousValue.push(unitCov)
        return previousValue
      }
      
      let reduced = result?.details?.['runTestResult']?.['codeCoverage'].reduce(reducer,[])
      
      output.codeCoverage = reduced.sort((a,b) => (a.numLocationsNotCovered > b.numLocationsNotCovered) ? -1 : ((b.numLocationsNotCovered > a.numLocationsNotCovered) ? 1 : 0))
    } else {
      output.codeCoverage = 'N/A'
    }
    
    return output
  }
}
