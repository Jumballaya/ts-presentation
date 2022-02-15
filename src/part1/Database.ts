import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Collection } from "./Collection";

export class Database {

  constructor(private readonly dataPath: string = './.data') { };

  public async createCollection<T>(name: string): Promise<Collection<T>> {
    if (await this.collectionExists(name)) {
      return await this.readCollection(name) as Collection<T>;
    }
    const collection = new Collection<T>(name, name, this.dataPath);

    // Create File
    const fp = path.resolve(this.dataPath, `${name}.collection`);
    await promisify(fs.writeFile)(fp, '[]');

    return collection;
  }

  public async readCollection<T>(name: string): Promise<Collection<T> | null> {
    const fp = path.resolve(this.dataPath, `${name}.collection`);
    // Find and read file
    try {
      const data = await promisify(fs.readFile)(fp);
      return Collection.fromJSON(name, data.toString());
    } catch (_) {
      return await this.createCollection(name);
    }
  }

  public async updateCollection<T>(oldName: string, update: { name: string }): Promise<Collection<T> | null> {
    if (await this.collectionExists(oldName)) {
      const oldCollection = await this.readCollection<T>(oldName);
      if (oldCollection) {
        const updatedCollection = Collection.fromCollection<T>(oldCollection, update.name, update.name);
        await this.deleteCollection(oldName);
        await updatedCollection.save();
        return updatedCollection;
      }
      const col = await this.createCollection<T>(update.name);
      return col;
    }
    return null;
  }

  public async deleteCollection(name: string): Promise<boolean> {
    if (await this.collectionExists(name)) {
      // Delete file
      const fp = path.resolve(this.dataPath, `${name}.collection`);
      await promisify(fs.rm)(fp);
      return true;
    }
    return false;
  }

  private async collectionExists(name: string): Promise<boolean> {
    try {
      const fp = path.resolve(this.dataPath, `${name}.collection`);
      const stat = await promisify(fs.lstat)(fp);
      return stat.isFile();
    } catch (_) {
      return false;
    }
  }

}