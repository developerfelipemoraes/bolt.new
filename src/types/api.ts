export interface ApiResponse<T> {
  Success: boolean;
  Data: T;
  Message: string;
  Error: string;
}
