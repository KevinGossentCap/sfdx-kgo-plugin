module.exports = {
  mdapiCliExclusiveFlagError: 'Specify either --%s or --%s but not both.',
  mdDeployCommandCliNoRestDeploy:
    'REST deploy is not available for this org. This feature is currently for internal Salesforce use only.',
  mdDeployCommandCliDescription: 'deploy metadata to an org using Metadata API',
  mdDeployCommandCliLong:
    'Deploys file representations of components into an org by creating or updating the ' +
    'components they represent. You can deploy and retrieve up to 10,000 files or 400 MB (39 MB compressed) ' +
    'at one time. The default target username is the admin user for the default scratch org.',
  mdDeployReportCommandCliDescription: 'check the status of a metadata deployment',
  mdDeployReportCommandCliLong: 'Checks the current status of an asynchronous metadata deployment.',
  mdDeployReportCommandCliHelp:
    'Specify the job ID for the deploy you want to check. You can also specify a wait time ' +
    '(minutes) to check for updates to the deploy status.',
  mdDeployCommandCliHelp:
    'Specify the location of the files to deploy as a .zip file or by the root of the ' +
    'directory tree containing the files. To check the status of a deployment, specify its job ID. To run quick deploy of a ' +
    'recently validated package, use --validateddeployrequestid with the validated ID.' +
    '\n\nTo wait for the command to finish running no matter how long the deployment takes, set --wait to -1: ' +
    '"sfdx force mdapi:deploy -w -1 ...".',
  mdDeployCommandCliCheckOnly: 'validate deploy but don’t save to the org',
  mdDeployCommandCliCheckOnlyLong:
    'Validates the deployed metadata and runs all Apex tests, but prevents the ' +
    'deployment from being saved to the org.' +
    '\nIf you change a field type from Master-Detail to Lookup or vice versa, that change isn’t supported when ' +
    'using the --checkonly parameter to test a deployment (validation). This kind of change isn’t supported for ' +
    'test deployments to avoid the risk of data loss or corruption. If a change that isn’t supported for test ' +
    'deployments is included in a deployment package, the test deployment fails and issues an error.' +
    '\nIf your deployment package changes a field type from Master-Detail to Lookup or vice versa, you can ' +
    'still validate the changes prior to deploying to Production by performing a full deployment to another ' +
    'test Sandbox. A full deployment includes a validation of the changes as part of the deployment process.' +
    '\nNote: A Metadata API deployment that includes Master-Detail relationships deletes all detail records in ' +
    'the Recycle Bin in the following cases.' +
    '\n1. For a deployment with a new Master-Detail field, soft delete (send to the Recycle Bin) all detail ' +
    'records before proceeding to deploy the Master-Detail field, or the deployment fails. During the deployment, ' +
    'detail records are permanently deleted from the Recycle Bin and cannot be recovered.' +
    '\n2. For a deployment that converts a Lookup field relationship to a Master-Detail relationship, ' +
    'detail records must reference a master record or be soft-deleted (sent to the Recycle Bin) for the deployment ' +
    'to succeed. However, a successful deployment permanently deletes any detail records in the Recycle Bin.',
  mdDeployCommandCliDeployDir: 'root of directory tree of files to deploy',
  mdDeployCommandCliDeployDirLong:
    'The root of the directory tree that contains the files to deploy. The root ' +
    'must contain a valid package.xml file describing the entities in the directory structure. Required to ' +
    'initiate a deployment if you don’t use --zipfile. If you specify both --zipfile and --deploydir, a zip ' +
    'file of the contents of the --deploydir directory is written to the location specified by --zipfile.',
  mdapiCliWait: 'wait time for command to finish in minutes (default: %s)',
  mdapiCliWaitLong: 'The number of minutes to wait for the command to complete. The default is –1 (no limit).',
  mdDeployCommandCliJobId:
    'job ID of the deployment you want to check; defaults to your most recent CLI deployment if not specified',
  mdDeployCommandCliJobIdLong:
    'The job ID (asyncId) of the deployment you want to check. If not specified, the default value is the ID ' +
    'of the most recent metadata deployment you ran using Salesforce CLI. Use with -w to resume waiting.',
  mdDeployCommandCliTestLevel: 'deployment testing level',
  mdDeployCommandCliTestLevelLong:
    'Specifies which level of deployment tests to run. Valid values are:\n' +
    'NoTestRun—No tests are run. This test level applies only to deployments to development environments, ' +
    'such as sandbox, Developer Edition, or trial orgs. This test level is the default for development ' +
    'environments.\n' +
    'RunSpecifiedTests—Runs only the tests that you specify in the --runtests option. Code coverage ' +
    'requirements differ from the default coverage requirements when using this test level. Executed tests ' +
    'must comprise a minimum of 75% code coverage for each class and trigger in the deployment package. This ' +
    'coverage is computed for each class and trigger individually and is different than the overall coverage ' +
    'percentage.\n' +
    'RunLocalTests—All tests in your org are run, except the ones that originate from installed managed ' +
    'packages. This test level is the default for production deployments that include Apex classes or triggers.\n' +
    'RunAllTestsInOrg—All tests in your org are run, including tests of managed packages.\n' +
    'If you don’t specify a test level, the default behavior depends on the contents of your deployment ' +
    'package. For more information, see “Running Tests in a Deployment” in the Metadata API Developer Guide.',
  mdDeployCommandCliRunTests: 'tests to run if --testlevel RunSpecifiedTests',
  mdDeployCommandCliRunTestsLong:
    'Lists the Apex classes containing the deployment tests to run. Use this parameter when you set --testlevel to RunSpecifiedTests.',
  mdDeployCommandCliIgnoreErrors: 'ignore any errors and do not roll back deployment',
  mdDeployCommandCliIgnoreErrorsLong:
    'Ignores the deploy errors, and continues with the ' +
    'deploy operation. The default is false. Keep this parameter set to false when deploying to a production org. ' +
    'If set to true, components without errors are deployed, and components with errors are skipped.',
  mdDeployCommandCliIgnoreWarnings: 'whether a warning will allow a deployment to complete successfully',
  mdDeployCommandCliIgnoreWarningsLong:
    'If a warning occurs and ignoreWarnings is set to true, the success field in ' +
    'DeployMessage is true. When ignoreWarnings is set to false, success is set to false, and the warning is treated like an error.\n' +
    'This field is available in API version 18.0 and later. Prior to version 18.0, there was no distinction between warnings and errors. ' +
    'All problems were treated as errors and prevented a successful deployment.',
  mdDeployCommandCliZipFile: 'path to .zip file of metadata to deploy',
  mdDeployCommandCliZipFileLong:
    'The path to the .zip file of metadata files to deploy. You must indicate this option or --deploydir.' +
    'If you specify both --zipfile and --deploydir, a .zip file of the contents of the deploy directory is created at the path ' +
    'specified for the .zip file.',
  mdDeployCommandCliVerbose: 'verbose output of deploy results',
  mdDeployCommandCliVerboseLong: 'Indicates that you want verbose output from the deploy operation.',
  mdDeployReportCommandCliVerboseLong: 'Indicates that you want verbose output for deploy results.',
  mdDeployCommandCliValidatedDeployRequestId: 'request ID of the validated deployment to run a Quick Deploy',
  mdDeployCommandCliValidatedDeployRequestIdLong:
    'Specifies the ID of a package with recently validated components to run a Quick Deploy. Deploying a validation helps you shorten your ' +
    'deployment time because tests aren’t rerun. If you have a recent successful validation, you can deploy the validated components without running tests. A validation ' +
    'doesn’t save any components in the org. You use a validation only to check the success or failure messages that you would receive with an actual deployment. ' +
    'To validate your components, add the -c | --checkonly flag when you run "sfdx force:mdapi:deploy". This flag sets the checkOnly="true" parameter for your deployment. Before deploying a ' +
    'recent validation, ensure that the following requirements are met:' +
    '\n1. The components have been validated successfully for the target environment within the last 10 days.' +
    '\n2. As part of the validation, Apex tests in the target org have passed.' +
    '\n3. Code coverage requirements are met.' +
    '\n     - If all tests in the org or all local tests are run, overall code coverage is at least 75%, and Apex triggers have some coverage.' +
    '\n     - If specific tests are run with the RunSpecifiedTests test level, each class and trigger that was deployed is covered by at least 75% individually.',
  mdDeployCommandSinglePackageDescription:
    'Indicates that the zip file points to a directory structure for a single package',
  mdDeployCommandSinglePackageDescriptionLong:
    'Indicates that the specified .zip file points to a directory structure for a single package. By default, the CLI assumes the directory is structured for a set of packages.'
};
