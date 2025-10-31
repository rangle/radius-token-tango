import semver from "semver";
import { TokenLayers } from "./token-parser.types";

export const indexAllVariables = <T extends Pick<TokenLayers, "layers">>({
  layers,
}: T) => {
  const allVariables = layers.flatMap(({ variables }) => variables);
  return allVariables.reduce(
    (acc, variable) => {
      return acc[variable.name]
        ? {
          ...acc,
          [variable.name]: `${acc[variable.name]}--${variable.value}`,
        }
        : { ...acc, [variable.name]: variable.value };
    },
    {} as Record<string, string>
  );
};

export const diffTokenLayers = (
  newLayers: TokenLayers,
  oldLayers: TokenLayers | undefined
) => {
  const layersToCompare = oldLayers ?? { layers: [] };
  const left = indexAllVariables(newLayers);
  const right = indexAllVariables(layersToCompare);
  const onlyLeft = Object.keys(left).filter((n) => !right[n]);
  const leftValues = Object.keys(left).filter(
    (n) => right[n] && left[n] !== right[n]
  );
  const onlyRight = Object.keys(right).filter((n) => !left[n]);
  return [onlyLeft, leftValues, onlyRight] as const;
};

export type BumpType = "minor" | "patch" | "major";
export type BumpStrategy = (version: string) => (idx: 0 | 1 | 2) => BumpType;

// the strategy is different based on whether the version number is currently under 1.0.0 or not
// under 1.0.0, the major version number is never bumped - only the minor and patch numbers
const bumpStrategies: BumpStrategy = (version) =>
  semver.lt(version, "1.0.0")
    ? (idx) => (["minor", "patch", "patch"] as const)[idx]
    : (idx) => (["major", "minor", "patch"] as const)[idx];

// bump the version number based on the changes to the tokens (see bumpStrategies above)
// when you want to do a stable release and bump the major number, you must do this manually in the package.json of your tokens package
export const semVerBump = (
  version: string,
  changes: [additions: boolean, modifications: boolean, breaking: boolean]
): string => {
  const [additions, modifications, breaking] = changes;

  const bump = bumpStrategies(version);
  return ([breaking, additions, modifications] as const).reduce(
    (acc, change, idx) =>
      !change || acc !== version
        ? acc
        : semver.inc(version, bump(idx as 0 | 1 | 2)) ?? version,
    version
  );
};

// Expected results - semVerBump(version, [minor changes, patch changes, major changes])

// Version numbers under 1.0.0

// semVerBump("0.0.0", [false, false, false]) /* 0.0.0 */; //?
// semVerBump("0.0.0", [true, false, false]) /* 0.1.0 */; //?
// semVerBump("0.0.0", [false, true, false]) /* 0.1.0 */; //?
// semVerBump("0.0.0", [false, false, true]) /* 0.0.1 */; //?
// semVerBump("0.1.0", [false, false, false]) /* 0.1.0 */; //?
// semVerBump("0.1.0", [false, false, true]) /* 0.2.0 */; //?
// semVerBump("0.1.0", [false, true, false]) /* 0.1.1 */; //?
// semVerBump("0.1.0", [true, false, false]) /* 0.1.1 */; //?

// Version numbers equal to or greater than 1.0.0

// semVerBump("1.1.0", [false, false, true]) /* 1.0.0 */; //?
// semVerBump("1.1.0", [false, true, false]) /* 1.1.1 */; //?
// semVerBump("2.1.0", [true, false, false]) /* 2.2.0 */; //?
// semVerBump("2.1.0", [false, true, false]) /* 2.1.1 */; //?
// semVerBump("2.1.0", [true, true, false]) /* 2.2.0 */; //?
// semVerBump("2.1.0", [false, false, true]) /* 3.0.0 */; //?
// semVerBump("2.1.0", [true, true, true]) /* 3.0.0 */; //?
