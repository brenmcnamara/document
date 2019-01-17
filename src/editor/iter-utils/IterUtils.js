/* @flow */

/**
 * TODO: Add unit tests.
 * TODO: Look for other open source equivalents to this.
 */
const IterUtils = {
  /**
   * TODO: DOCUMENT ME
   */
  createIterable<T>(iteratorFn: () => Iterator<T>): Iterable<T> {
    // $FlowFixMe - This is correct
    return { [Symbol.iterator]: iteratorFn };
  },

  /**
   * TODO: DOCUMENT ME
   */
  iterFromIterable<T>(iterable: Iterable<T>): Iterator<T> {
    // $FlowFixMe - This is correct
    return iterable[Symbol.iterator]();
  },

  /**
   * TODO: DOCUMENT ME
   */
  filter<T>(iterator: Iterator<T>, predicate: T => boolean): Iterator<T> {
    return {
      next: () => {
        let result = iterator.next();
        while (!result.done && !predicate(result.value)) {
          result = iterator.next();
        }
        return result;
      },
    };
  },

  /**
   * TODO: DOCUMENT ME
   */
  first<T>(iterator: Iterator<T>): ?T {
    const result = iterator.next();
    return result.done ? undefined : result.value;
  },

  /**
   * TODO: DOCUMENT ME
   */
  last<T>(iterator: Iterator<T>): ?T {
    let result = iterator.next();
    let last = undefined;
    while (!result.done) {
      last = result.value;
      result = iterator.next();
    }
    return last;
  },

  /**
   * TODO: DOCUMENT ME
   */
  nth<T>(iterator: Iterator<T>, n: number): T {
    let result = iterator.next();
    let i = 0;
    while (!result.done && i !== n) {
      result = iterator.next();
      ++i;
    }
    if (result.done) {
      throw Error(`Iterator out of range: ${n}`);
    }
    return result.value;
  },

  /**
   * TODO: DOCUMENT ME
   */
  iterateTo(iterator: Iterator<any>, item: any): boolean {
    let result = iterator.next();
    while (!result.done && result.value !== item) {
      result = iterator.next();
    }
    return result.value === item;
  },

  /**
   * TODO: DOCUMENT ME
   */
  indexOf(iterator: Iterator<any>, item: any): number {
    let i = 0;
    let result = iterator.next();
    while (!result.done && result.value !== item) {
      result = iterator.next();
      ++i;
    }
    return result.done ? -1 : i;
  },

  /**
   * TODO: DOCUMENT ME
   */
  zip<T, S>(iter1: Iterator<T>, iter2: Iterator<S>): Iterator<[T, S]> {
    // $FlowFixMe - Need to figure out how to type iterators properly.
    const iteratorFn: () => Iterator<[T, S]> = () => {
      let result1 = iter1.next();
      let result2 = iter2.next();
      return {
        next: () => {
          if (result1.done || result2.done) {
            return { done: true };
          }
          result1 = iter1.next();
          result2 = iter2.next();
          if (result1.done || result2.done) {
            return { done: true };
          }
          return { done: false, value: [result1.value, result2.value] };
        },
      };
    };

    return iteratorFn();
  },

  /**
   * TODO: DOCUMENT ME
   */
  zipExhaust<T, S>(iter1: Iterator<T>, iter2: Iterator<S>): Iterator<[?T, ?S]> {
    // $FlowFixMe - Need to figure out how to type iterators properly.
    const iteratorFn: () => Iterator<[T, S]> = () => {
      let result1 = iter1.next();
      let result2 = iter2.next();
      return {
        next: () => {
          if (result1.done && result2.done) {
            return { done: true };
          }
          const value = [
            result1.done ? undefined : result1.value,
            result2.done ? undefined : result2.value,
          ];

          result1 = iter1.next();
          result2 = iter2.next();
          return { done: false, value };
        },
      };
    };

    return iteratorFn();
  },

  /**
   * Returns the previous item to a particular item, or undefined if there is
   * no previous item.
   *
   * @throws { Error } If the previous item does not exist in the list.
   */
  prevOf<T>(iterator: Iterator<T>, item: T): ?T {
    let prev = undefined;
    let result = iterator.next();
    while (!result.done && result.value !== item) {
      prev = result.value;
      result = iterator.next();
    }
    if (result.value === item) {
      return prev;
    }
    throw Error('Could not find item in the iterator');
  },
};

export default IterUtils;
