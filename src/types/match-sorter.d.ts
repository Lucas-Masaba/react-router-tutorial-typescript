declare module 'match-sorter' {
  function matchSorter<T>(
    list: T[],
    value: string
  ): T[];

  export default matchSorter;
}