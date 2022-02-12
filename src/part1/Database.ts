import { Collection } from "./Collection";

export class Database {

  private data: Map<string, Collection<unknown>> = new Map();

  public createCollection<T>(name: string, typeName?: string): Collection<T> {
    if (this.data.has(name)) {
      const collection = this.data.get(name);
      const type = collection?.type;
      throw new Error(`Unable to create collection ${name}. It already exists with type ${type}`);
    }
    const collection = new Collection<T>(name, typeName || name);
    this.data.set(name, collection);
    return collection;
  }

  public readCollection<T>(name: string): Collection<T> | null {
    const collection = this.data.get(name);
    if (collection) {
      return collection as Collection<T>;
    }
    return null;
  }

  public updateCollection<T>(oldName: string, update: { name: string; type: string; }): Collection<T> | null {
    if (this.data.has(oldName)) {
      const oldCollection = this.readCollection<T>(oldName);
      if (oldCollection) {
        const updatedCollection = Collection.fromCollection<T>(oldCollection, update.name, update.type);
        this.data.set(update.name, updatedCollection);
        this.data.delete(oldName);
      }
      const col = this.createCollection<T>(update.name, update.type);
      this.data.set(update.name, col);
      return col;
    }
    return null;
  }

  public deleteCollection(name: string) {
    if (this.data.has(name)) {
      this.data.delete(name);
    }
  }

}