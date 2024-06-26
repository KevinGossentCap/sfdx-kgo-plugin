import { dirname, join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfProject } from '@salesforce/core';
import { ComponentSetBuilder, MetadataComponent, SourceComponent } from '@salesforce/source-deploy-retrieve';
import { filePathsFromMetadataComponent } from '@salesforce/source-deploy-retrieve/lib/src/utils/filePathGenerator.js';
import { Metadata, MetadataType, MetadataDefinition } from '@jsforce/jsforce-node/lib/api/metadata.js';
import { Builder } from 'xml2js';
// import { XMLBuilder } from 'fast-xml-parser';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sfdx-kgo-plugin', 'kgo.source.read');

export type KgoSourceReadResult = void;

export default class KgoSourceRead extends SfCommand<KgoSourceReadResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'target-org': Flags.requiredOrg(),
    metadata: Flags.string({
      summary: messages.getMessage('flags.metadata.summary'),
      char: 'm',
      multiple: true,
    }),
    'source-dir': Flags.directory({
      summary: messages.getMessage('flags.source-dir.summary'),
      char: 'd',
      multiple: true,
      exists: true,
    }),
  };

  public async run(): Promise<KgoSourceReadResult> {
    const { flags } = await this.parse(KgoSourceRead);

    const project = await SfProject.resolve();
    const packageDirectories = project.getPackageDirectories();
    const defaultPackageDirectory = project.getDefaultPackage().path;
    const sourcePaths = packageDirectories.map((dir) => dir.path);

    const componentSet = await ComponentSetBuilder.build({
      sourcepath: flags['source-dir'],
      ...(flags.metadata && {
        metadata: {
          metadataEntries: flags.metadata,
          directoryPaths: sourcePaths,
        },
      }),
    });

    for (const component of componentSet) {
      this.log('reading', `${component.type.name}:${component.fullName}`, '...');
      // eslint-disable-next-line no-await-in-loop
      const mdJson = await this.getResult(component);
      let filePath;
      if (component instanceof SourceComponent) {
        filePath = component.xml;
      } else {
        filePath = filePathsFromMetadataComponent(component, join(defaultPackageDirectory, 'main', 'default')).find(
          (p) => p.endsWith(`.${component.type.suffix}-meta.xml`)
        );
        mkdirSync(dirname(filePath as string), { recursive: true });
      }
      writeFileSync(filePath as string, convertToXml(component, mdJson));
    }

    return;
  }

  protected async getResult(
    component: MetadataComponent | SourceComponent
  ): Promise<MetadataDefinition<MetadataType, Metadata>> {
    const { flags } = await this.parse(KgoSourceRead);
    return flags['target-org']
      .getConnection(undefined)
      .metadata.read(component.type.name as MetadataType, component.fullName);
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToXml(component: MetadataComponent | SourceComponent, data: any): string {
  if (['CustomObject', 'Workflow'].includes('' + component.parent?.type?.name)) {
    // remove first part of fullName separated by dot
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    data.fullName = component.fullName.split('.')[1];
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete data.fullName;
  }
  return (
    new Builder({
      xmldec: {
        version: '1.0',
        encoding: 'UTF-8',
      },
      rootName: component.type.name,
      renderOpts: {
        pretty: true,
        indent: ' '.repeat(4), // 4 spaces
        newline: '\n',
      },
    }).buildObject({
      ...data,
      ...{
        $: {
          xmlns: 'http://soap.sforce.com/2006/04/metadata',
        },
      },
    }) + '\n'
  );
}
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function fastConvertToXml(component: MetadataComponent | SourceComponent, data: any): string {
//   if (['CustomObject', 'Workflow'].includes('' + component.parent?.type?.name)) {
//     // remove first part of fullName separated by dot
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     data.fullName = component.fullName.split('.')[1];
//   } else {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     delete data.fullName;
//   }
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
//   data['@_xmlns'] = 'http://soap.sforce.com/2006/04/metadata';
//   const options = {
//     processEntities: false,
//     format: true,
//     ignoreAttributes: false,
//     // preserveOrder: true,
//     textNodeName: '_',
//     indentBy: ' '.repeat(4),
//   };
//   const dataString = '{"?xml": {"@_version": "1.0", "@_encoding": "UTF-8"},"' + component.type.name + '":' + data + '}';
//   const builder = new XMLBuilder(options);
//   return builder.build(dataString) + '\n';
// }
