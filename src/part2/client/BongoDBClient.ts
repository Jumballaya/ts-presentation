import net from 'net';
import { BongoDBResponse } from '../interfaces/bongo-db-response.interface';
import { BongoDBCollection } from './BongoDBCollection';

export class BongoDBClient {

  private socket: net.Socket | null = null;
  private listener: any;
  private opts: { host: string; port: number; };

  constructor(opts: net.TcpNetConnectOpts | URL | string) {
    this.opts = this.getOpts(opts);
    this.socket = this.connect();
  }

  public close() {
    if (this.socket) {
      this.socket.end();
    }
  }

  public async createCollection<T>(name: string, type: string): Promise<BongoDBCollection<T>> {
    const obj = {
      collection: {
        create: {
          name,
          type,
        }
      }
    };
    const objStr = JSON.stringify(obj);
    const res = await this.send<BongoDBResponse>(objStr);
    if (res.success) {
      return new BongoDBCollection<T>(this, name, type);
    }
    if (res.message?.includes('It already exists with type')) {
      return new BongoDBCollection<T>(this, name, type);
    }
    throw new Error(res.message);
  }

  public async getCollection<T>(name: string, type: string): Promise<BongoDBCollection<T>> {
    const obj = {
      collection: {
        read: {
          name,
        }
      }
    };
    const objStr = JSON.stringify(obj);
    const res = await this.send<BongoDBResponse>(objStr);
    if (res.success) {
      return new BongoDBCollection(this, name, type);
    }
    return this.createCollection(name, type);
  }

  public send<R>(data: string): Promise<R> {
    return new Promise((resolve) => {
      if (this.socket) {
        if (this.listener) {
          this.socket.removeListener('data', this.listener);
        }
        this.listener = this.dataListener<R>(resolve);
        this.socket.on('data', this.listener);
        this.socket.write(data);
      }
    });
  }

  private dataListener<R>(resolve: (r: R) => void) {
    return (data: string) => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        console.log(e);
      }
    }
  }

  private connect(): net.Socket {
    return net.createConnection(this.opts, this.onConnect.bind(this));
  }

  private onConnect() {
    const { host, port } = this.opts;
    console.log(`Connected to bongodb://${host}:${port}`);
  }

  private getOpts(opts: net.TcpNetConnectOpts | URL | string) {
    if (typeof opts === 'string') {
      opts = new URL(opts);
    }
    if (opts instanceof URL) {
      return {
        host: opts.hostname,
        port: parseInt(opts.port),
      }
    }
    return {
      host: opts.host || 'localhost',
      port: opts.port,
    };
  }

}