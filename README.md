sfdx-kgo-plugin
===============

SFDX plugin of great daily use tools

[![Version](https://img.shields.io/npm/v/sfdx-kgo-plugin.svg)](https://npmjs.org/package/sfdx-kgo-plugin)
[![CircleCI](https://circleci.com/gh/KevinGossentCap/sfdx-kgo-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/KevinGossentCap/sfdx-kgo-plugin/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/KevinGossentCap/sfdx-kgo-plugin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-kgo-plugin/branch/master)
[![Codecov](https://codecov.io/gh/KevinGossentCap/sfdx-kgo-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/KevinGossentCap/sfdx-kgo-plugin)
[![Greenkeeper](https://badges.greenkeeper.io/KevinGossentCap/sfdx-kgo-plugin.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/KevinGossentCap/sfdx-kgo-plugin/badge.svg)](https://snyk.io/test/github/KevinGossentCap/sfdx-kgo-plugin)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-kgo-plugin.svg)](https://npmjs.org/package/sfdx-kgo-plugin)
[![License](https://img.shields.io/npm/l/sfdx-kgo-plugin.svg)](https://github.com/KevinGossentCap/sfdx-kgo-plugin/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-kgo-plugin
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-kgo-plugin/0.0.14 win32-x64 node-v16.13.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx kgo:data:count [-e <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-kgodatacount--e-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx kgo:deploy:result -i <id> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-kgodeployresult--i-id--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx kgo:limits [-l <array>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-kgolimits--l-array--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx kgo:data:count [-e <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieves record counts from REST API recordCount

```
retrieves record counts from REST API recordCount

USAGE
  $ sfdx kgo:data:count [-e <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --entity-where-clause=entity-where-clause                                     optionnal constraints to add to the
                                                                                    entityDefenition query where clause

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx kgo:data:count --targetusername myOrg@example.com
       will give you the record count it can find from recordCount API for the most number of objects in the ORG
    
  $ sfdx kgo:data:count --targetusername myOrg@example.com --entity-where-clause 'IsLayoutable=true AND 
  IsEverCreatable=true AND IsCustomizable=true'
       will give you the record count it can find from recordCount API with object list restriction usefull msot of the 
  time
```

_See code: [src/commands/kgo/data/count.ts](https://github.com/KevinGossentCap/sfdx-kgo-plugin/blob/v0.0.14/src/commands/kgo/data/count.ts)_

## `sfdx kgo:deploy:result -i <id> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

fast get deploy result, statistics and error list

```
fast get deploy result, statistics and error list

USAGE
  $ sfdx kgo:deploy:result -i <id> [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --jobid=jobid                                                                 (required) job ID of the deployment
                                                                                    you want to check; defaults to your
                                                                                    most recent CLI deployment if not
                                                                                    specified

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/kgo/deploy/result.ts](https://github.com/KevinGossentCap/sfdx-kgo-plugin/blob/v0.0.14/src/commands/kgo/deploy/result.ts)_

## `sfdx kgo:limits [-l <array>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

get filtered and formated limits from API

```
get filtered and formated limits from API

USAGE
  $ sfdx kgo:limits [-l <array>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -l, --limits=limits                                                               optionnal list of limits to show ;
                                                                                    comma seperated

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/kgo/limits.ts](https://github.com/KevinGossentCap/sfdx-kgo-plugin/blob/v0.0.14/src/commands/kgo/limits.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
