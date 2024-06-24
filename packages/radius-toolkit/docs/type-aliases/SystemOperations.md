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

[lib/exporting/exporter.utils.ts:6](https://github.com/rangle/radius-token-tango/blob/0fa25351e79af51a833bcebadbd83e27a9791a4f/packages/radius-toolkit/src/lib/exporting/exporter.utils.ts#L6)
