// Generator Mappings for CSS
import { GeneratorMappingDictionary } from "../../lib/tokens";

export default {
  css: [
    ["color", "color"],
    [/--asset/, [[/(http.*)/g, `'$&'`]]],
    [
      /--typography/,
      [
        [/Light/g, "300"],
        [/Regular/g, "400"],
        [/Medium/g, "500"],
        [/Semi Bold/g, "600"],
        [/Bold Condensed/g, "700"],
        [/Extra Bold/g, "800"],
        [/Bold/g, "700"],
        [/Heavy/g, "900"],
        [/Black/g, "900"],
      ],
    ],
    [
      /--letterSpacing/,
      // preserve sign ($1), divide value ($2) by 100, replace % with em
      [[/(-?)([0-9]*)%/g, "calc($1$2em/100)"]],
    ],
    [
      /--boxShadow/,
      // add missing `px` suffix to all lone numbers
      [[/\d+(?![^()]*\))/g, "$&px"]],
    ],
    [
      /--direction.*/,
      // replace `vertical` with `column` and `horizontal` with `row`
      [
        [/^vertical$/, "column"],
        [/^horizontal$/, "row"],
      ],
    ],
  ],
} satisfies GeneratorMappingDictionary;
