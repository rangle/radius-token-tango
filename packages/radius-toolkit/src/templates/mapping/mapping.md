## Value Mapping for Generators

Creates a mechanism to allow developer using the token extractor to create mappings for values that might not be compatible between the source (Figma) and the generated target (ex.: CSS).

The mechanism allows you to create a different map for each type of export, in the form of a file that is prefixed by the name of the template where it applies (ex.: `mappings/css-generator.ts` is the file that contains the mappings for the css template). Alternative file names that allow the user to concentrate all mappings in one file were also provided.

The structure of the map file is as simple as I could make it, while giving all the necessary powers to the user.

- it allows simple syntax `[“fromX”, “toX”]` for global replacements of the value of a token
- it allows a Regular expression `[/Regular/g, “400”]` to allow replacing part of the content of a token
- it allows to use a function as the replacement `[/^full$/g, (value) => "100%; /* “ + value + “ */"]` to allow smarter replacing
- it allows the function replacements to optionally make use of the regexp match array `[/^([0-9][0-9])px$/g, (value: string, matches: RegExpMatchArray) => Number(matches[0]) / 16.0 + "rem; /* “ + value + " */"]`
- it allows a group of replacements to be conditioned to a pattern in the token key:

```
[/—typography/,
  [[/Regular/g, “400”], [/Bold/g, “700”]]
]
```

- the planned feature of allowing separate replacement mappings for the _input parsing_ and the _output generation_ phases was removed from scope. current implementation only applies replacements to the _output generation_
