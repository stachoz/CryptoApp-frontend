export interface PagedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}