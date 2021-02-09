import {SfdxCommand, flags, FlagsConfig, SfdxResult} from '@salesforce/command'
import {AnyJson} from '@salesforce/ts-types'

// const formatTabColomn = {
//   columns: [
//     {key: 'name', label: 'Name'},
//     {key: 'rate', label: 'Percent used'},
//     {key: 'max', label: 'Max usable'},
//     {key: 'left', label: 'Remaining'}
//   ]
// }

export default class KgoLimits extends SfdxCommand {
  static description = 'get filtered and formated limits from API'

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false

  protected static flagsConfig: FlagsConfig = {
    limits: flags.array({description: 'optionnal list of limits to show ; comma seperated', char: 'l', required: false, delimiter: ','})
  }

  public static result: SfdxResult = {
    tableColumnData: {
      columns: [
        {key: 'name', label: 'Name'},
        {key: 'rate', label: 'Percent used'},
        {key: 'max', label: 'Max usable'},
        {key: 'left', label: 'Remaining'}
      ]
    }
  }

  public async run(): Promise<AnyJson> {
    // const {flags} = this.parse(KgoLimits)

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection()
    // conn.cache.clear()

    let limitResult = await conn.limits()
    let keysToOutput: string[]
    if (this.flags.limits) {
      keysToOutput = this.flags.limits
    } else {
      keysToOutput = Object.keys(limitResult)
    }
    let filteredLimitResult = []
    keysToOutput.sort().forEach((elem: string) => {
      const localElem = limitResult[elem]
      filteredLimitResult.push({
        'name': elem,
        'rate': (100 * (localElem.Max - localElem.Remaining) / localElem.Max).toFixed(2) + ' %',
        'max': localElem.Max,
        'left': localElem.Remaining
      })
    })

    // let result = []
    // this.ux.logJson(filteredLimitResult)
    // this.ux.table(filteredLimitResult, formatTabColomn)

    return filteredLimitResult
  }
}
