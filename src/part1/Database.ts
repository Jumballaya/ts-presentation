import { Collection } from "./Collection";

export class Database {

  private data: Record<string, Collection<unknown>> = {};

  public createCollection<T>(name: string, typeName?: string): Collection<T> {
    if (name in this.data) {
      const collection = this.data[name];
      const { type } = collection;
      throw new Error(`Unable to create collection ${name}. It already exists with type ${type}`);
    }
    const collection = new Collection<T>(name, typeName || name);
    this.data[name] = collection;
    return collection;
  }

  public readCollection<T>(name: string): Collection<T> | null {
    const collection = this.data[name];
    if (collection) {
      return collection as Collection<T>;
    }
    return null;
  }

  public updateCollection<T>(oldName: string, update: { name: string; type: string; }): Collection<T> | null {
    if (this.data[oldName]) {
      const oldCollection = this.readCollection<T>(oldName);
      if (oldCollection) {
        this.data[update.name] = Collection.fromCollection<T>(oldCollection, update.name, update.type);
        delete this.data[oldName];
      }
      const col = this.createCollection<T>(update.name, update.type);
      this.data[update.name] = col;
      return col;
    }
    return null;
  }

  public deleteCollection(name: string) {
    if (this.data[name]) {
      delete this.data[name];
    }
  }

}