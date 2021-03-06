import {flags, FlagsConfig, SfdxCommand, SfdxResult} from '@salesforce/command'
// import {flags, SfdxCommand} from '@salesforce/command'
// import {Messages, SfdxError} from '@salesforce/core';
import {AnyJson} from '@salesforce/ts-types'
import * as _ from 'lodash'

export default class KgoDataCount extends SfdxCommand {
  static description = 'retrieves record counts from REST API recordCount'

  static examples = [
    `$ sfdx kgo:data:count --targetusername myOrg@example.com
    will give you the record count it can find from recordCount API for the most number of objects in the ORG
    `,
    `$ sfdx kgo:data:count --targetusername myOrg@example.com --entity-where-clause 'IsLayoutable=true AND IsEverCreatable=true AND IsCustomizable=true'
    will give you the record count it can find from recordCount API with object list restriction usefull msot of the time
    `
  ];

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false

  protected static flagsConfig: FlagsConfig = {
    'entity-where-clause': flags.string({description: 'optionnal constraints to add to the entityDefenition query where clause', char: 'e', required: false})
  }

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
        {key: 'Oname', label: 'sObject Name'},
        {key: 'Ocount', label: 'Count'},
        {key: 'Mname', label: 'Metadata type Name'},
        {key: 'Mcount', label: 'Count'},
        {key: 'Cname', label: 'Custom Setting Name'},
        {key: 'Ccount', label: 'Count'},
        {key: 'Uname', label: 'Uncounted sObject Name'},
        {key: 'Ucount', label: 'Count'}
      ]
    },
    display() {
      // {'Data Storage': [], 'Metadata type Storage': [], 'Custom Settings Storage': [], 'Not counted Storage': []}
      let numSize = 0
      for (let elem of Object.keys(this.data)) {
        numSize = Math.max(numSize, this.data?.[elem]?.length)
      }
      if (numSize) {
        let outputResult = []
        for (let i = 0; i < numSize; i++) {
          outputResult.push({
            Oname: this.data?.['Data Storage']?.[i]?.name,
            Ocount: this.data?.['Data Storage']?.[i]?.count,
            Mname: this.data?.['Metadata type Storage']?.[i]?.name,
            Mcount: this.data?.['Metadata type Storage']?.[i]?.count,
            Cname: this.data?.['Custom Settings Storage']?.[i]?.name,
            Ccount: this.data?.['Custom Settings Storage']?.[i]?.count,
            Uname: this.data?.['Not counted Storage']?.[i]?.name,
            Ucount: this.data?.['Not counted Storage']?.[i]?.count
          })
        }
        this.ux.table(outputResult, this.tableColumnData)
      }
      // for (let elem of Object.keys(this.data)) {
      //   if (this.data?.[elem]?.length) {
      //     this.ux.log(elem)
      //     this.ux.table(this.data[elem], this.tableColumnData)
      //     this.ux.log('')
      //   }
      // }
    }
  }

  public async run(): Promise<AnyJson> {
    // const {args, flags} = this.parse(KgoDataCount)

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection()
    conn.cache.clear()
    // keyprefix<>'' AND IsDeprecatedAndHidden=false AND IsIdEnabled=true AND IsLayoutable=true AND IsEverCreatable=true AND IsCustomizable=true
    let queryEntityDefinition = 'SELECT QualifiedApiName, IsCustomSetting, IsLayoutable, KeyPrefix FROM EntityDefinition WHERE KeyPrefix<>\'\' AND IsDeprecatedAndHidden=false AND IsIdEnabled=true'

    if (this.flags?.['entity-where-clause']?.length) queryEntityDefinition += ' AND ' + this.flags['entity-where-clause']
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
