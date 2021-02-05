import {SfdxCommand} from '@salesforce/command'
// import {flags, SfdxCommand} from '@salesforce/command'
// import {Messages, SfdxError} from '@salesforce/core';
import {AnyJson} from '@salesforce/ts-types'
import * as _ from 'lodash'

const formatTabColomn = {
  columns: [
    {key: 'name', label: 'Name'},
    {key: 'count', label: 'Count'}
  ]
}

export default class KgoDataCount extends SfdxCommand {
  static description = 'describe the command here'

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false

  // static flags = {
  //   help: flags.help({char: 'h'}),
  //   // flag with a value (-n, --name=VALUE)
  //   name: flags.string({char: 'n', description: 'name to print'}),
  //   // flag with no value (-f, --force)
  //   force: flags.boolean({char: 'f'}),
  // }

  // static args = [{name: 'file'}]

  treatResultType(result, strType: string, objectsToCount: string[], objectRecordMap) {
    let tmpArray = []
    for (let elem of objectsToCount) {
      tmpArray.push({'name': elem, 'count': objectRecordMap?.[elem]?.count})
    }
    if (!_.isEmpty(tmpArray)) {
      result[strType] = tmpArray
      this.ux.log(strType)
      result[strType] = _.orderBy(result[strType], [i => _.isNil(i?.['count']), 'count', 'name'], ['asc', 'desc', 'asc'])
      this.ux.table(result[strType], formatTabColomn)
      this.ux.log('')
    }
  }

  public async run(): Promise<AnyJson> {
    // const {args, flags} = this.parse(KgoDataCount)

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection()
    const queryEntityDefinition = 'SELECT QualifiedApiName, IsCustomSetting, IsLayoutable, KeyPrefix FROM EntityDefinition WHERE IsCustomizable=true AND IsDeprecatedAndHidden=false AND IsIdEnabled=true'
    const excludeDataCountList: string[] = ['CollaborationGroupRecord', 'FeedItem', 'OpportunityLineItem', 'AccountContactRelation', 'User', 'OpportunityContactRole', 'Product2', 'PricebookEntry']

    // The type we are querying for
    interface EntityDefinition {
      QualifiedApiName: string
      IsCustomSetting: boolean
      IsLayoutable: boolean
      KeyPrefix: string
    }

    // The type for recordCount Rest API call
    interface sobjectsResult {
      sObjects: Array<sobjectsEntry>
    }
    interface sobjectsEntry {
      name: string;
      count: number;
    }

    const keyBy = (array, key) => (array || []).reduce((r, x) => ({...r, [key ? x[key] : x]: x}), {});

    // Query to get sObjects list with some properties
    const resultEntityDefinition = await conn.query<EntityDefinition>(queryEntityDefinition)

    const objectsToCount = new Array<string>()
    const mdtToCount = new Array<string>()
    const custSetToCount = new Array<string>()
    const noDataCount = new Array<string>()
    for (let entry of resultEntityDefinition.records) {
      if (entry.QualifiedApiName.endsWith('__e')) continue
      if (entry.QualifiedApiName.endsWith('__mdt')) {
        mdtToCount.push(entry.QualifiedApiName)
      } else if (entry.IsCustomSetting) {
        custSetToCount.push(entry.QualifiedApiName)
      } else if (excludeDataCountList.includes(entry.QualifiedApiName)) {
        noDataCount.push(entry.QualifiedApiName)
      } else {
        objectsToCount.push(entry.QualifiedApiName)
      }
    }

    const objectRecordCount = await conn.request('/limits/recordCount?sObjects=' + new Array<string>().concat(objectsToCount, mdtToCount, custSetToCount, noDataCount).join()) as unknown as sobjectsResult

    // const objectRecordMap = objectRecordCount['sObjects'].map(obj => {
    //   let rObj = {}
    //   rObj[obj.name] = obj
    //   return rObj
    // })
    const objectRecordMap = keyBy(objectRecordCount['sObjects'], 'name')
    const result = {'Data Storage': [], 'Metadata type Storage': [], 'Custom Settings Storage': [], 'Not counted Storage': []}
    // let tmpArray = []
    // let tmpType = 'Data Storage'
    // for (let elem of objectsToCount) {
    //   tmpArray.push({'name': elem, 'count': objectRecordMap?.[elem]?.count})
    // }
    // result[tmpType] = tmpArray
    // this.ux.log('\n', tmpType)
    // result[tmpType] = _.orderBy(result[tmpType], [i => _.isNil(i?.['count']), 'count', 'name'], ['asc', 'desc', 'asc'])
    // this.ux.table(result[tmpType], formatTabColomn)
    this.treatResultType(result, 'Data Storage', objectsToCount, objectRecordMap)

    // tmpArray = []
    // tmpType = 'Metadata type Storage'
    // for (let elem of mdtToCount) {
    //   tmpArray.push({'name': elem, 'count': objectRecordMap?.[elem]?.count})
    // }
    // result[tmpType] = tmpArray
    // this.ux.log('\n', tmpType)
    // result[tmpType] = _.orderBy(result[tmpType], [i => _.isNil(i?.['count']), 'count', 'name'], ['asc', 'desc', 'asc'])
    // this.ux.table(result[tmpType], formatTabColomn)
    this.treatResultType(result, 'Metadata type Storage', mdtToCount, objectRecordMap)

    // tmpArray = []
    // tmpType = 'Custom Settings Storage'
    // for (let elem of custSetToCount) {
    //   tmpArray.push({'name': elem, 'count': objectRecordMap?.[elem]?.count})
    // }
    // result[tmpType] = tmpArray
    // this.ux.log('\n', tmpType)
    // result[tmpType] = _.orderBy(result[tmpType], [i => _.isNil(i?.['count']), 'count', 'name'], ['asc', 'desc', 'asc'])
    // this.ux.table(result[tmpType], formatTabColomn)
    this.treatResultType(result, 'Custom Settings Storage', custSetToCount, objectRecordMap)

    // tmpArray = []
    // tmpType = 'Not counted Storage'
    // for (let elem of noDataCount) {
    //   tmpArray.push({'name': elem, 'count': objectRecordMap?.[elem]?.count})
    // }
    // result[tmpType] = tmpArray
    // this.ux.log('\n', tmpType)
    // result[tmpType] = _.orderBy(result[tmpType], [i => _.isNil(i?.['count']), 'count', 'name'], ['asc', 'desc', 'asc'])
    // this.ux.table(result[tmpType], formatTabColomn)
    this.treatResultType(result, 'Not counted Storage', noDataCount, objectRecordMap)

    // // this.ux.logJson(objectRecordCount)
    // this.ux.table(objectRecordCount['sObjects'], {
    //   columns: [
    //     {key: 'name', label: 'Name'},
    //     {key: 'count', label: 'Count'}
    //   ]
    // })

    return {result}
  }
}
