export type TSortParams<T> = {
  order?: Record<keyof T, -1 | 1>;
};
