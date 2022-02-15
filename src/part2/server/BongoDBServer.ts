import net, { Socket, Server } from 'net';
import { Database } from '../../part1/Database';
import { commandParser } from './command-parser';
import { Command } from './interfaces/command.interface';
import { CommandType } from './enums/command-types.enum';


export class BongoDBServer {

  private server: Server;
  private db: Database = new Database();

  constructor(private readonly port = 8080) {
    this.server = net.createServer(this.listener.bind(this));
  }

  public start() {
    this.server.listen(this.port, this.startup.bind(this));
  }

  private listener(socket: Socket): void {
    socket.on('data', data => {
      try {

        const json: Command = JSON.parse(data.toString());
        const command = commandParser(json);

        if (command.startsWith('collection')) {
          this.handleCollectionCommand(json, socket, command);
        }

        if (command.startsWith('entry')) {
          this.handleEntryCommand(json, socket, command);
        }

        if (command === 'error') {
          throw new Error(`Could not issue command: ${data}`);
        }

      } catch (e) {
        if (e instanceof Error) {
          socket.write(JSON.stringify({ success: false, message: e.message }));
          socket.end();
          return;
        }
      }
    })
  }

  private async handleEntryCommand(json: Command, socket: Socket, command: CommandType) {

    switch (command) {

      case 'entry:create': {
        const cmd = json.entry?.create;
        if (cmd) {
          const { collection, payload } = cmd
          const col = await this.db.readCollection(collection);
          if (!col) {
            throw new Error(`Unable to find collection: ${collection}`);
          }
          col.create(payload);
          socket.write(JSON.stringify({ success: true }));
        }
        return;
      }

      case 'entry:read': {
        const cmd = json.entry?.read;
        if (cmd) {
          const name = cmd.collection;
          const collection = await this.db.readCollection(name);
          const query = cmd.query || {};
          if (!collection) {
            throw new Error(`Unable to find collection: ${name}`);
          }
          socket.write(JSON.stringify({
            success: true,
            payload: await collection.read(query)
          }));
        }
        return;
      }

      case 'entry:update': {
        const cmd = json.entry?.update;
        if (cmd) {
          const name = cmd.collection;
          const collection = await this.db.readCollection(name);
          const query = cmd.query || {};
          const updates = cmd.updates || {};
          if (!updates) {
            return;
          }
          if (!collection) {
            throw new Error(`Unable to find collection: ${name}`);
          }
          const payload = await collection.update(query, updates);
          socket.write(JSON.stringify({
            success: true,
            payload,
          }));
        }
        return;
      }

      case 'entry:delete': {
        const cmd = json.entry?.delete;
        if (cmd) {
          const name = cmd.collection;
          const collection = await this.db.readCollection(name);
          const query = cmd.query || {};
          if (!collection) {
            throw new Error(`Unable to find collection: ${name}`);
          }
          const payload = await collection.delete(query);
          socket.write(JSON.stringify({
            success: true,
            payload,
          }));
        }
        return;
      }

    }

  }

  private async handleCollectionCommand(json: Command, socket: Socket, command: CommandType) {

    switch (command) {
      case 'collection:create': {
        const cmd = json.collection?.create;
        if (cmd) {
          this.db.createCollection(cmd.name);
          socket.write(JSON.stringify({ success: true }));
        }
        return;
      }

      case 'collection:read': {
        const cmd = json.collection?.read;
        if (cmd) {
          const collection = await this.db.readCollection(cmd.name);
          if (collection) {
            socket.write(JSON.stringify({ success: true }));
            return;
          }
          socket.write(JSON.stringify({ success: false, message: `Collection ${cmd.name} does not exist` }));
        }
        return;
      }

      case 'collection:update': {
        const cmd = json.collection?.update;
        if (cmd) {
          const collection = await this.db.readCollection(cmd.name);
          if (collection) {
            this.db.updateCollection(cmd.name, {
              name: cmd.updates?.name || cmd.name,
            });
            socket.write(JSON.stringify({ success: true }));
            return;
          }
          socket.write(JSON.stringify({ success: false, message: `Collection ${cmd.name} does not exist` }));
        }
        return;
      }

      case 'collection:delete': {
        const cmd = json.collection?.delete;
        if (cmd) {
          const collection = await this.db.readCollection(cmd.name);
          if (collection) {
            this.db.deleteCollection(cmd.name);
            socket.write(JSON.stringify({ success: true }));
            return;
          }
          socket.write(JSON.stringify({ success: false, message: `Collection ${cmd.name} does not exist` }));
        }
        return;
      }
    }
  }

  private startup() {
    console.log(`BongoDB: Listening on port ${this.port}`);
  }
}