type AsyncPredicate<T> = (
  value: T,
  index: number,
  array: T[]
) => Promise<boolean> | boolean;

/**
 * Async version of Array.prototype.find
 * @param array array to search
 * @param predicate function to test each element of the array
 * @returns promise that resolves to the first element in the array that satisfies the provided testing function
 */

export async function asyncFind<T>(
  array: T[],
  predicate: AsyncPredicate<T>
): Promise<T | undefined> {
  return array.reduce(
    async (
      acc: Promise<T | undefined>,
      current: T,
      index: number,
      arr: T[]
    ) => {
      const found = await acc;
      if (found) return found;

      const result = await predicate(current, index, arr);
      return result ? current : undefined;
    },
    Promise.resolve<T | undefined>(undefined)
  );
}
