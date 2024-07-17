[**radius-toolkit**](../README.md) • **Docs**

***

[radius-toolkit](../globals.md) / SystemOperations

# Type Alias: SystemOperations

> **SystemOperations**: `object`

A type to be used to inject system operations into the services

## Type declaration

### loadFile()

> **loadFile**: (`fileName`) => `Promise`\<`Buffer`\>

#### Parameters

• **fileName**: `string`

#### Returns

`Promise`\<`Buffer`\>

### readStdin()

> **readStdin**: () => `Promise`\<`Buffer`\>

#### Returns

`Promise`\<`Buffer`\>

### writeFile()

> **writeFile**: (`fileName`, `buffer`) => `Promise`\<`void`\>

#### Parameters

• **fileName**: `string`

• **buffer**: `Buffer`

#### Returns

`Promise`\<`void`\>

### writeToStdout()

> **writeToStdout**: (`buffer`) => `void`

#### Parameters

• **buffer**: `Buffer`

#### Returns

`void`

## Defined in

[lib/exporting/exporter.utils.ts:6](https://github.com/rangle/radius-token-tango/blob/5b6e6f5adbda55f8c41a4c8308d1d8885a9b9a2f/packages/radius-toolkit/src/lib/exporting/exporter.utils.ts#L6)
