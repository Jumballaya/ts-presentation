import fs from 'fs';
import path from "path";
import { promisify } from "util";
import { Indexable } from "./types/indexable.type";

export class Collection<T> {
  private data: Indexable<T>[] = [];
  private id = 0;

  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly dataPath = '.data',
  ) { }

  static fromJSON<T>(name: string, dataString: string): Collection<T> {
    const data: Indexable<T>[] = JSON.parse(dataString.toString());
    const col = new Collection<T>(name, name);
    col.data = data;
    col.id = data.length;
    return col;
  }

  static fromCollection<B>(collection: Collection<B>, name: string, type: string) {
    const col = new Collection<B>(name, type);
    col.data = collection.data;
    col.id = collection.id;
    return col;
  }

  public async create(items: T[]): Promise<Indexable<T>[]> {
    await this.updateFS();

    const indexedItems = items.map(item => ({
      _id: (this.id++).toString(),
      ...item,
    }));

    console.log(this.data);

    this.data.push(...indexedItems);

    await this.save();

    return indexedItems;
  }

  public async read(query: Partial<Indexable<T>>): Promise<Indexable<T>[]> {
    await this.updateFS();

    if (query === {}) {
      return this.data;
    }
    const found = this.data.filter(item => this.matchObjects(query, item));

    await this.save();

    return found;
  }

  public async update(query: Partial<Indexable<T>>, update: Partial<T>): Promise<Indexable<T>[]> {
    await this.updateFS();

    const found = await this.read(query)
    const updates = found.map((item) => {
      return this.updateById(item._id, update);
    });

    await this.save();

    return updates;
  }

  public async delete(query: Partial<Indexable<T>>): Promise<Indexable<T>[]> {
    await this.updateFS();

    const found = await this.read(query)
    const deleted = found.map((item) => {
      return this.deleteById(item._id);
    });

    await this.save();

    return deleted;
  }

  public async save(): Promise<boolean> {
    const data = this.data
    const name = this.name;
    const fp = path.resolve(this.dataPath, `${name}.collection`);
    try {
      await promisify(fs.writeFile)(fp, JSON.stringify(data, null, 2));
      return true;
    } catch (_) {
      return false;
    }
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

  private async updateFS(): Promise<boolean> {
    const name = this.name;
    const fp = path.resolve(this.dataPath, `${name}.collection`);
    try {
      const dataBuf = await promisify(fs.readFile)(fp);
      const data = JSON.parse(dataBuf.toString());
      this.data = data;
      return true;
    } catch (_) {
      return false;
    }
  }
}