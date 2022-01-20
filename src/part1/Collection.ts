import { Indexable } from "./types/indexable.type";

export class Collection<T> {
  private data: Indexable<T>[] = [];
  private id = 0;

  constructor(public readonly name: string, public readonly type: string) { }

  static fromCollection<B>(collection: Collection<B>, name: string, type: string) {
    const col = new Collection<B>(name, type);
    col.data = collection.data;
    col.id = collection.id;
    return col;
  }

  public create(items: T[]): Indexable<T>[] {
    const indexedItems = items.map(item => ({
      _id: (this.id++).toString(),
      ...item,
    }));
    this.data.push(...indexedItems);

    return indexedItems;
  }

  public read(query: Partial<Indexable<T>>): Indexable<T>[] {
    if (query === {}) {
      return this.data;
    }
    const found = this.data.filter(item => this.matchObjects(query, item));
    return found;
  }

  public update(query: Partial<Indexable<T>>, update: Partial<T>): Indexable<T>[] {
    const found = this.read(query)
    return found.map((item) => {
      return this.updateById(item._id, update);
    });
  }

  public delete(query: Partial<Indexable<T>>): Indexable<T>[] {
    const found = this.read(query)
    return found.map((item) => {
      return this.deleteById(item._id);
    });
  }

  private updateById(id: string, update: Partial<T>): Indexable<T> {
    const index = this.data.findIndex(v => v._id === id);
    if (index !== -1) {
      const updatedEntry: Indexable<T> = {
        ...this.data[index],
        ...update,
      };
      this.data[index] = updatedEntry;
      return updatedEntry;
    }
    throw new Error(`Collection ${this.name} does not have entry with ID ${id}`);
  }

  private deleteById(id: string): Indexable<T> {
    const index = this.data.findIndex(v => v._id === id);
    if (index !== -1) {
      const found = { ...this.data[index] };
      this.data = this.data.filter(v => v._id !== id);
      return found;
    }
    throw new Error(`Collection ${this.name} does not have entry with ID ${id}`);
  }

  private matchObjects(query: Partial<T>, indexed: Indexable<T>): boolean {
    let matching = true;
    for (const k in query) {
      const qValue = (k in query) ? query[k] : '';
      const iValue = (k in indexed) ? indexed[k] : '';
      const matches = qValue && iValue && (qValue === iValue);
      if (!matches) {
        matching = false;
      }
    }
    return matching;
  }
}