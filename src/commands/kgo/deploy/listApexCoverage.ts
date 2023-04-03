import {SfdxCommand, flags, FlagsConfig, SfdxResult} from '@salesforce/command'
import {Messages} from '@salesforce/core'
import {AnyJson} from '@salesforce/ts-types'
declare var __dirname;

Messages.importMessagesDirectory(__dirname);
const messages: Messages = Messages.loadMessages('sfdx-kgo-plugin', 'mdapi_deploy');

export default class KgoDeployListApexCoverage extends SfdxCommand {
  static description = 'fast get deploy coverage details, defaults to ordered by uncovered desc then number of lines desc'

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false
  
  public static result: SfdxResult = {
    display() {
      this.ux.log('ApexClass test Coverage')
      this.ux.table(this.data?.['codeCoverage'] as unknown as any[], {
        columns: [
          {key: 'type'},
          {key: 'name'},
          {key: 'numLocations'},
          {key: 'numLocationsNotCovered'},
          {key: 'pctCoverage'}
        ],
      })
      this.ux.log('\nDeployed Flow test Coverage')
      this.ux.table(this.data?.['flowCoverage']?.['deployed'] as unknown as any[], {
        columns: [
          {key: 'type'},
          {key: 'name'},
          {key: 'numLocations'},
          {key: 'numLocationsNotCovered'},
          {key: 'pctCoverage'}
        ],
      })
      this.ux.log('\nOthers Flow test Coverage')
      this.ux.table(this.data?.['flowCoverage']?.['others'] as unknown as any[], {
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
    }),
    sortpct: flags.boolean({
      char: 'p',
      description: 'sort by coverage percentage ascending then number of lines desc',
      required: false
    })
  }

  public dynamicSort(property: string) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  public dynamicSortMultiple(args: string[]) {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
      var i = 0, result = 0, numberOfProperties = props.length;
      /* try getting a different result from 0 (equal)
       * as long as we have extra properties to compare
       */
      while (result === 0 && i < numberOfProperties) {
        result = this.dynamicSort(props[i])(obj1, obj2);
        i++;
      }
      return result;
    }
  }

  public async run(): Promise<AnyJson> {

    function dynamicSort(property: string) {
      var sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    }
    function dynamicSortMultiple(...args: string[]) {
      /*
       * save the arguments object as it will be overwritten
       * note that arguments object is an array-like object
       * consisting of the names of the properties to sort by
       */
      var props = arguments;
      return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while (result === 0 && i < numberOfProperties) {
          result = dynamicSort(props[i])(obj1, obj2);
          i++;
        }
        return result;
      }
    }
    
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
        unitCov.pctCoverage = (100 - 100 * unitCov.numLocationsNotCovered / unitCov.numLocations)

        previousValue.push(unitCov)
        return previousValue
      }

      let reduced = result?.details?.['runTestResult']?.['codeCoverage'].reduce(reducer, [])

      if (this.flags.sortpct) {
        output.codeCoverage = reduced.sort(dynamicSortMultiple("pctCoverage", "-numLocations"))
      } else {
        output.codeCoverage = reduced.sort(dynamicSortMultiple("-numLocationsNotCovered", "-numLocations"))
      }
    } else {
      output.codeCoverage = 'N/A'
    }
    
    if (result?.details?.['runTestResult']?.['flowCoverage']) {
    
      const flowReducer = (previousValue, currentValue) => {
        if (currentValue.componentType = 'Flow') {
          previousValue.push(currentValue.fullName)
        }
        return previousValue
      }
      
      let lstDeployedFlows = result?.details?.['componentSuccesses']?.reduce(flowReducer,[])
      
      const reducer = (previousValue, currentValue) => {
        let unitCov: AnyJson = {}
        unitCov.type = currentValue.processType
        unitCov.name = currentValue.flowName
        unitCov.numLocations = parseInt(currentValue.numElements)
        unitCov.numLocationsNotCovered = parseInt(currentValue.numElementsNotCovered)
        unitCov.pctCoverage = (100 - 100 * unitCov.numLocationsNotCovered / unitCov.numLocations)
        
        if (lstDeployedFlows.includes(currentValue.flowName)) {
          previousValue.deployed.push(unitCov)
        } else {
          previousValue.others.push(unitCov)
        }
        return previousValue
      }
      
      let reduced = result?.details?.['runTestResult']?.['flowCoverage'].reduce(reducer,{deployed: [], others: []})
      
      reduced.deployed = reduced.deployed.sort(dynamicSortMultiple("pctCoverage", "-numElements"))
      reduced.others = reduced.others.sort(dynamicSortMultiple("pctCoverage", "-numElements"))
      
      output.flowCoverage = reduced
    } else {
      output.flowCoverage = 'N/A'
    }

    return output
  }
}
