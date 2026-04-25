export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  errorCode?: string; // Optional field based on backend implementation
}
