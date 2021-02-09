import {SfdxCommand, SfdxResult} from '@salesforce/command'
// import {flags, SfdxCommand} from '@salesforce/command'
// import {Messages, SfdxError} from '@salesforce/core';
import {AnyJson} from '@salesforce/ts-types'
import * as _ from 'lodash'

export default class KgoDataCount extends SfdxCommand {
  static description = 'retrieves record counts from REST API recordCount'

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false

  treatResultType(result, strType: string, objectsToCount: string[], objectRecordMap) {
    let tmpArray = []
    for (let elem of objectsToCount) {
      tmpArray.push({'name': elem, 'count': objectRecordMap?.[elem]?.count})
    }
    if (!_.isEmpty(tmpArray)) {
      result[strType] = tmpArray
      result[strType] = _.orderBy(result[strType], [i => _.isNil(i?.['count']), 'count', 'name'], ['asc', 'desc', 'asc'])
    }
  }

  public static result: SfdxResult = {
    tableColumnData: {
      columns: [
        {key: 'name', label: 'Name'},
        {key: 'count', label: 'Count'}
      ]
    },
    display() {
      for (let elem of Object.keys(this.data)) {
        if (this.data?.[elem]?.length) {
          this.ux.log(elem)
          this.ux.table(this.data[elem], this.tableColumnData)
          this.ux.log('')
        }
      }
    }
  }

  public async run(): Promise<AnyJson> {
    // const {args, flags} = this.parse(KgoDataCount)

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection()
    conn.cache.clear()
    const queryEntityDefinition = 'SELECT QualifiedApiName, IsCustomSetting, IsLayoutable, KeyPrefix FROM EntityDefinition WHERE IsCustomizable=true AND IsDeprecatedAndHidden=false AND IsIdEnabled=true'
    const excludeDataCountList: string[] = ['CollaborationGroupRecord', 'FeedItem', 'OpportunityLineItem', 'AccountContactRelation', 'User', 'OpportunityContactRole', 'Product2', 'Pricebook2', 'PricebookEntry', 'Asset']

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

    const objectRecordMap = keyBy(objectRecordCount['sObjects'], 'name')
    const result = {'Data Storage': [], 'Metadata type Storage': [], 'Custom Settings Storage': [], 'Not counted Storage': []}

    this.treatResultType(result, 'Data Storage', objectsToCount, objectRecordMap)
    this.treatResultType(result, 'Metadata type Storage', mdtToCount, objectRecordMap)
    this.treatResultType(result, 'Custom Settings Storage', custSetToCount, objectRecordMap)
    this.treatResultType(result, 'Not counted Storage', noDataCount, objectRecordMap)

    return result
  }
}
