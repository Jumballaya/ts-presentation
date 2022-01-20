
export interface EntryCommand {


  create?: {
    collection: string;
    payload: Record<string, unknown>[];
  };

  read?: {
    collection: string;
    query?: Record<string, unknown>;
  };

  update?: {
    collection: string;
    updates: Record<string, unknown>;
    query: Record<string, unknown>;
  };

  delete?: {
    collection: string;
    query?: Record<string, unknown>;
  };

}