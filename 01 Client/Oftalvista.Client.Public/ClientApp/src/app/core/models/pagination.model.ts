export interface paginatedItemsRequest<TFilter> {
  pageSize: number;
  skip: number;
  sortField: string;
  sortDir: string;
  filter: TFilter;
}
export interface paginatedItemsResponse<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}
