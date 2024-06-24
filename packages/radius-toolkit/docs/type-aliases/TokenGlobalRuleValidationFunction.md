[**radius-toolkit**](../README.md) • **Docs**

***

[radius-toolkit](../globals.md) / TokenGlobalRuleValidationFunction

# Type Alias: TokenGlobalRuleValidationFunction()

> **TokenGlobalRuleValidationFunction**: (`collections`) => [`TokenGlobalRuleValidationResult`](TokenGlobalRuleValidationResult.md)

## Parameters

• **collections**: [`TokenNameCollection`](TokenNameCollection.md)[]

The token name collections to validate

## Returns

[`TokenGlobalRuleValidationResult`](TokenGlobalRuleValidationResult.md)

An array of tuples representing every error or warning found in the collections. if all collections are valid, the array will be empty
each error or warning is represented by a tuple with the first element indicating the collection name, the second the token name, the third element indicating the message and the fourth indicating the offending segments

## Defined in

[lib/formats/format.types.ts:116](https://github.com/rangle/radius-token-tango/blob/0fa25351e79af51a833bcebadbd83e27a9791a4f/packages/radius-toolkit/src/lib/formats/format.types.ts#L116)
