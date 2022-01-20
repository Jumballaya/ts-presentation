export interface BongoDBResponse<T = never> {
  success: boolean;
  message?: string;
  payload?: T[];
}
