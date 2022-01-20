import { BongoDBResponse } from "../interfaces/bongo-db-response.interface";
import { BongoDBClient } from "./BongoDBClient";

export class BongoDBCollection<T> {

  constructor(
    private readonly client: BongoDBClient,
    private readonly name: string,
    private readonly type: string
  ) { }

  public create<T>(data: T | T[]): Promise<BongoDBResponse> {
    const obj = {
      entry: {
        create: {
          collection: this.name,
          payload: (data instanceof Array) ? data : [data],
        }
      }
    };
    const objStr = JSON.stringify(obj);
    return this.client.send<BongoDBResponse>(objStr);
  }

  public read<T>(query?: Partial<T>): Promise<BongoDBResponse<T>> {
    const obj = {
      entry: {
        read: {
          collection: this.name,
          ...(query ? { query } : {}),
        },
      }
    };
    const objStr = JSON.stringify(obj);
    return this.client.send<BongoDBResponse<T>>(objStr);
  }

  public update<T>(updates: Partial<T>, query: Partial<T>): Promise<BongoDBResponse<T>> {
    const obj = {
      entry: {
        update: {
          collection: this.name,
          query,
          updates,
        },
      }
    };
    const objStr = JSON.stringify(obj);
    return this.client.send<BongoDBResponse<T>>(objStr);
  }

  public delete<T>(query: Partial<T>): Promise<BongoDBResponse<T>> {
    const obj = {
      entry: {
        delete: {
          collection: this.name,
          query,
        },
      }
    };
    const objStr = JSON.stringify(obj);
    return this.client.send<BongoDBResponse<T>>(objStr);
  }

}