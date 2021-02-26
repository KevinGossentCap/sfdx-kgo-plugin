import {SfdxCommand, flags, FlagsConfig, SfdxResult} from '@salesforce/command'
import {Messages} from '@salesforce/core'
import {AnyJson} from '@salesforce/ts-types'

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
    tableColumnData: {
      columns: [
        {key: 'index'},
        {key: 'name'},
        {key: 'methodName'},
        {key: 'stackTrace'},
        {key: 'message'}
      ],
    },
    display() {
      this.ux.table(this.data as unknown as any[], this.tableColumnData)
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
    // this.ux.log(result.status)
    // this.ux.styledJSON(result?.details?.['runTestResult']?.failures)
    let failures: AnyJson = result?.details?.['runTestResult']?.failures
    for (let index = 0; index < Object.keys(failures).length; index++) {
      failures[index]["index"] = index + 1
    }
    return failures
  }
}
