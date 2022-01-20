
export interface CollectionCommand {

  create?: {
    name: string;
    type: string;
  };

  read?: {
    name: string;
  }

  update?: {
    name: string;
    updates: {
      name?: string;
      type?: string;
    }
  }

  delete?: {
    name: string;
  }

}