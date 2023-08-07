declare module 'match-sorter' {
  function matchSorter<T>(
    list: T[],
    value: string,
    options: {
      keys: Array<keyof T>;
    }
  ): T[];

  export default matchSorter;
}