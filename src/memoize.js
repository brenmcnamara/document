/* @flow */

export default function memoize<T>(cb: () => T): () => T {
  let result: T | null = null;
  return () => {
    if (!result) {
      result = cb();
    }
    return result;
  };
}
