export interface PaginatedRequest<T> {
  pageSize: number;
  skip: number;
  sortField: string;
  sortDir: string;
  filter: T;
}

export interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface CatalogoItem {
  value: number;
  text: string;
}
