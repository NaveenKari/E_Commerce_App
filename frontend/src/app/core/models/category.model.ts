export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface CategoryResponse {
  categoryDTOList: Category[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
