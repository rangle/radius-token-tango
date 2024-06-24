[**radius-toolkit**](../README.md) • **Docs**

***

[radius-toolkit](../globals.md) / TokenRuleValidationFunction

# Type Alias: TokenRuleValidationFunction()

> **TokenRuleValidationFunction**: (`name`, `type`) => [`TokenNameValidationResult`](TokenNameValidationResult.md)

## Parameters

• **name**: `string`

The token name to validate

• **type**: `string`

## Returns

[`TokenNameValidationResult`](TokenNameValidationResult.md)

A tuple with the first element indicating if the token name is valid
and the second element providing a message if the token name is invalid
and the third element providing a list of offending segments
if a message is returned but the first element is true, consider the message as a warning

## Defined in

[lib/formats/format.types.ts:105](https://github.com/rangle/radius-token-tango/blob/0fa25351e79af51a833bcebadbd83e27a9791a4f/packages/radius-toolkit/src/lib/formats/format.types.ts#L105)
