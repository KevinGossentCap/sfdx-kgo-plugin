# summary

Read Metadata using the CRUD Metadata API.

# description

Read Metadata using the CRUD Metadata API.

# examples

- <%= config.bin %> <%= command.id %> -m "Profile:Admin"
- <%= config.bin %> <%= command.id %> -m "RecordType:Account.Business"
- <%= config.bin %> <%= command.id %> -p force-app/main/default/objects/Account/recordTypes/Business.recordType-meta.xml

# flags.metadata.summary

Metadata component names to retrieve. Wildcards (`*`) supported as long as you use quotes, such as `ApexClass:MyClass*`.

# flags.source-dir.summary

File paths for source to retrieve from the org.

# flags.target-org.summary

undefined
