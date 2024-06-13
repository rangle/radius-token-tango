import semver from "semver";
import { TokenLayers } from "radius-toolkit";
import { n } from "vitest/dist/reporters-P7C2ytIv.js";

export const listLayers = ({ order }: TokenLayers) => order;

export const indexAllVariables = ({ layers }: TokenLayers) => {
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
    {} as Record<string, string>,
  );
};

export const diffTokenLayers = (
  newLayers: TokenLayers,
  oldLayers: TokenLayers,
) => {
  const left = indexAllVariables(newLayers);
  const right = indexAllVariables(oldLayers);
  const onlyLeft = Object.keys(left).filter((n) => !right[n]);
  const leftValues = Object.keys(left).filter(
    (n) => right[n] && left[n] !== right[n],
  );
  const onlyRight = Object.keys(right).filter((n) => !left[n]);
  return [onlyLeft, leftValues, onlyRight] as const;
};

export type BumpType = "minor" | "patch" | "major";
export type BumpStrategy = (version: string) => (idx: 0 | 1 | 2) => BumpType;

const bumpStrategies: BumpStrategy = (version) =>
  semver.lt(version, "1.0.0")
    ? (idx) => (["minor", "patch", "patch"] as const)[idx]
    : (idx) => (["major", "minor", "patch"] as const)[idx];

export const semVerBump = (
  version: string,
  changes: [additions: boolean, modifications: boolean, breaking: boolean],
): string => {
  const [additions, modifications, breaking] = changes;

  const bump = bumpStrategies(version);
  return ([breaking, additions, modifications] as const).reduce(
    (acc, change, idx) =>
      !change || acc !== version
        ? acc
        : semver.inc(version, bump(idx as 0 | 1 | 2)) ?? version,
    version,
  );
};

// semVerBump("0.0.0", [false, false, false]) /* 0.1.0 */; //?
// semVerBump("0.0.0", [true, false, false]) /* 0.1.0 */; //?
// semVerBump("0.0.0", [false, true, false]) /* 0.1.0 */; //?
// semVerBump("0.0.0", [false, false, true]) /* 0.1.0 */; //?
// semVerBump("0.1.0", [false, false, false]) /* 0.1.0 */; //?
// semVerBump("0.1.0", [false, false, true]) /* 0.2.0 */; //?
// semVerBump("0.1.0", [false, true, false]) /* 0.1.1 */; //?
// semVerBump("0.1.0", [true, false, false]) /* 0.1.1 */; //?
// semVerBump("1.1.0", [false, false, true]) /* 1.0.0 */; //?
// semVerBump("1.1.0", [false, true, false]) /* 1.1.1 */; //?
// semVerBump("2.1.0", [true, false, false]) /* 2.2.0 */; //?
// semVerBump("2.1.0", [false, true, false]) /* 2.1.1 */; //?
// semVerBump("2.1.0", [true, true, false]) /* 2.2.0 */; //?
// semVerBump("2.1.0", [false, false, true]) /* 3.0.0 */; //?
// semVerBump("2.1.0", [true, true, true]) /* 3.0.0 */; //?
