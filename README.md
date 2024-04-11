# sfdx-kgo-plugin

[![NPM](https://img.shields.io/npm/v/sfdx-kgo-plugin.svg?label=sfdx-kgo-plugin)](https://www.npmjs.com/package/sfdx-kgo-plugin) [![Downloads/week](https://img.shields.io/npm/dw/sfdx-kgo-plugin.svg)](https://npmjs.org/package/sfdx-kgo-plugin) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/sfdx-kgo-plugin/main/LICENSE.txt)

## Using the template

This repository provides a template for creating a plugin for the Salesforce CLI. To convert this template to a working plugin:

1. Please get in touch with the Platform CLI team. We want to help you develop your plugin.
2. Generate your plugin:

   ```
   sf plugins install dev
   sf dev generate plugin

   git init -b main
   git add . && git commit -m "chore: initial commit"
   ```

3. Create your plugin's repo in the salesforcecli github org
4. When you're ready, replace the contents of this README with the information you want.

## Learn about `sf` plugins

Salesforce CLI plugins are based on the [oclif plugin framework](<(https://oclif.io/docs/introduction.html)>). Read the [plugin developer guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_plugins.meta/sfdx_cli_plugins/cli_plugins_architecture_sf_cli.htm) to learn about Salesforce CLI plugin development.

This repository contains a lot of additional scripts and tools to help with general Salesforce node development and enforce coding standards. You should familiarize yourself with some of the [node developer packages](#tooling) used by Salesforce.

Additionally, there are some additional tests that the Salesforce CLI will enforce if this plugin is ever bundled with the CLI. These test are included by default under the `posttest` script and it is required to keep these tests active in your plugin if you plan to have it bundled.

### Tooling

- [@salesforce/core](https://github.com/forcedotcom/sfdx-core)
- [@salesforce/kit](https://github.com/forcedotcom/kit)
- [@salesforce/sf-plugins-core](https://github.com/salesforcecli/sf-plugins-core)
- [@salesforce/ts-types](https://github.com/forcedotcom/ts-types)
- [@salesforce/ts-sinon](https://github.com/forcedotcom/ts-sinon)
- [@salesforce/dev-config](https://github.com/forcedotcom/dev-config)
- [@salesforce/dev-scripts](https://github.com/forcedotcom/dev-scripts)

### Hooks

For cross clouds commands, e.g. `sf env list`, we utilize [oclif hooks](https://oclif.io/docs/hooks) to get the relevant information from installed plugins.

This plugin includes sample hooks in the [src/hooks directory](src/hooks). You'll just need to add the appropriate logic. You can also delete any of the hooks if they aren't required for your plugin.

# Everything past here is only a suggestion as to what should be in your specific plugin's description

This plugin is bundled with the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli). For more information on the CLI, read the [getting started guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm).

We always recommend using the latest version of these commands bundled with the CLI, however, you can install a specific version or tag if needed.

## Install

```bash
sf plugins install sfdx-kgo-plugin@x.y.z
```

## Issues

Please report any issues at https://github.com/forcedotcom/cli/issues

## Contributing

1. Please read our [Code of Conduct](CODE_OF_CONDUCT.md)
2. Create a new issue before starting your project so that we can keep track of
   what you are trying to add/fix. That way, we can also offer suggestions or
   let you know if there is already an effort in progress.
3. Fork this repository.
4. [Build the plugin locally](#build)
5. Create a _topic_ branch in your fork. Note, this step is recommended but technically not required if contributing using a fork.
6. Edit the code in your fork.
7. Write appropriate tests for your changes. Try to achieve at least 95% code coverage on any new code. No pull request will be accepted without unit tests.
8. Sign CLA (see [CLA](#cla) below).
9. Send us a pull request when you are done. We'll review your code, suggest any needed changes, and merge it in.

### CLA

External contributors will be required to sign a Contributor's License
Agreement. You can do so by going to https://cla.salesforce.com/sign-cla.

### Build

To build the plugin locally, make sure to have yarn installed and run the following commands:

```bash
# Clone the repository
git clone git@github.com:salesforcecli/sfdx-kgo-plugin

# Install the dependencies and compile
yarn && yarn build
```

To use your plugin, run using the local `./bin/dev` or `./bin/dev.cmd` file.

```bash
# Run using local run file.
./bin/dev hello world
```

There should be no differences when running via the Salesforce CLI or using the local run file. However, it can be useful to link the plugin to do some additional testing or run your commands from anywhere on your machine.

```bash
# Link your plugin to the sf cli
sf plugins link .
# To verify
sf plugins
```

## Commands

<!-- commands -->

- [`sf kgo deploy ListApexCoverage`](#sf-kgo-deploy-listapexcoverage)
- [`sf kgo deploy listCoverage`](#sf-kgo-deploy-listcoverage)
- [`sf kgo deploy result`](#sf-kgo-deploy-result)
- [`sf kgo limits`](#sf-kgo-limits)
- [`sf kgo source read`](#sf-kgo-source-read)

## `sf kgo deploy ListApexCoverage`

Fast get deploy Apex and Flow Coverage details, defaults to ordered by uncovered desc then number of lines desc.

```
USAGE
  $ sf kgo deploy ListApexCoverage -o <value> -i <value> [--json] [--flags-dir <value>] [-p]

FLAGS
  -i, --job-id=<value>      (required) Job ID of the deploy operation you want to check the status of.
  -o, --target-org=<value>  (required) [default: kevin.gossent+sfdc-ren-badge@gmail.com] Username or alias of the target
                            org. Not required if the `target-org` configuration variable is already set.
  -p, --sort-pct            Sort by coverage percentage ascending then number of lines desc.

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Fast get deploy Apex and Flow Coverage details, defaults to ordered by uncovered desc then number of lines desc.

  More information about a command. Don't repeat the summary.

ALIASES
  $ sf kgo deploy ListApexCoverage

EXAMPLES
  $ sf kgo deploy ListApexCoverage
```

## `sf kgo deploy listCoverage`

Fast get deploy Apex and Flow Coverage details, defaults to ordered by uncovered desc then number of lines desc.

```
USAGE
  $ sf kgo deploy listCoverage -o <value> -i <value> [--json] [--flags-dir <value>] [-p]

FLAGS
  -i, --job-id=<value>      (required) Job ID of the deploy operation you want to check the status of.
  -o, --target-org=<value>  (required) [default: kevin.gossent+sfdc-ren-badge@gmail.com] Username or alias of the target
                            org. Not required if the `target-org` configuration variable is already set.
  -p, --sort-pct            Sort by coverage percentage ascending then number of lines desc.

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Fast get deploy Apex and Flow Coverage details, defaults to ordered by uncovered desc then number of lines desc.

  More information about a command. Don't repeat the summary.

ALIASES
  $ sf kgo deploy ListApexCoverage

EXAMPLES
  $ sf kgo deploy listCoverage
```

_See code: [src/commands/kgo/deploy/listCoverage.ts](https://github.com/KevinGossentCap/sfdx-kgo-plugin/blob/v1.4.8/src/commands/kgo/deploy/listCoverage.ts)_

## `sf kgo deploy result`

Fast get deploy result, statistics and error list.

```
USAGE
  $ sf kgo deploy result -o <value> -i <value> [--json] [--flags-dir <value>]

FLAGS
  -i, --job-id=<value>      (required) Job ID of the deploy operation you want to check the status of.
  -o, --target-org=<value>  (required) [default: kevin.gossent+sfdc-ren-badge@gmail.com] Username or alias of the target
                            org. Not required if the `target-org` configuration variable is already set.

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Fast get deploy result, statistics and error list.

  More information about a command. Don't repeat the summary.

EXAMPLES
  $ sf kgo deploy result
```

_See code: [src/commands/kgo/deploy/result.ts](https://github.com/KevinGossentCap/sfdx-kgo-plugin/blob/v1.4.8/src/commands/kgo/deploy/result.ts)_

## `sf kgo limits`

Get filtered and formated limits from API.

```
USAGE
  $ sf kgo limits -o <value> [--json] [--flags-dir <value>] [-l <value>]

FLAGS
  -l, --limits=<value>...   Optionnal list of limits to show.
  -o, --target-org=<value>  (required) [default: kevin.gossent+sfdc-ren-badge@gmail.com] Username or alias of the target
                            org. Not required if the `target-org` configuration variable is already set.

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Get filtered and formated limits from API.

  More information about a command. Don't repeat the summary.

EXAMPLES
  $ sf kgo limits
```

_See code: [src/commands/kgo/limits.ts](https://github.com/KevinGossentCap/sfdx-kgo-plugin/blob/v1.4.8/src/commands/kgo/limits.ts)_

## `sf kgo source read`

Read Metadata using the CRUD Metadata API.

```
USAGE
  $ sf kgo source read -o <value> [--json] [--flags-dir <value>] [-m <value>] [-d <value>]

FLAGS
  -d, --source-dir=<value>...  File paths for source to retrieve from the org.
  -m, --metadata=<value>...    Metadata component names to retrieve. Wildcards (`*`) supported as long as you use
                               quotes, such as `ApexClass:MyClass*`.
  -o, --target-org=<value>     (required) [default: kevin.gossent+sfdc-ren-badge@gmail.com] Username or alias of the
                               target org. Not required if the `target-org` configuration variable is already set.

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Read Metadata using the CRUD Metadata API.

  More information about a command. Don't repeat the summary.

EXAMPLES
  $ sf kgo source read -m "Profile:Admin"

  $ sf kgo source read -m "RecordType:Account.Business"

  $ sf kgo source read -p force-app/main/default/objects/Account/recordTypes/Business.recordType-meta.xml
```

_See code: [src/commands/kgo/source/read.ts](https://github.com/KevinGossentCap/sfdx-kgo-plugin/blob/v1.4.8/src/commands/kgo/source/read.ts)_

<!-- commandsstop -->
