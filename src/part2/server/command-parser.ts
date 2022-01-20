import { Command } from "./interfaces/command.interface";
import { CommandType } from "./types/command-types.type";

const hasKey = (obj: any, key: string): boolean => {
  return obj && obj.hasOwnProperty(key) && obj[key];
}

export const commandParser = (command: Command): CommandType => {
  if (hasKey(command, 'collection')) {
    return parseCollectionCommands(command);
  }
  if (hasKey(command, 'entry')) {
    return parseEntryCommands(command);
  }
  return CommandType.Error;
}

const parseCollectionCommands = (command: Command): CommandType => {
  if (hasKey(command.collection, 'create')) {
    return CommandType.CollectionCreate;
  }
  if (hasKey(command.collection, 'read')) {
    return CommandType.CollectionRead;
  }
  if (hasKey(command.collection, 'update')) {
    return CommandType.CollectionUpdate;
  }
  if (hasKey(command.collection, 'delete')) {
    return CommandType.CollectionDelete;
  }
  return CommandType.Error;
}

const parseEntryCommands = (command: Command): CommandType => {
  if (hasKey(command.entry, 'create')) {
    return CommandType.EntryCreate;
  }
  if (hasKey(command.entry, 'read')) {
    return CommandType.EntryRead;
  }
  if (hasKey(command.entry, 'update')) {
    return CommandType.EntryUpdate;
  }
  if (hasKey(command.entry, 'delete')) {
    return CommandType.EntryDelete;
  }
  return CommandType.Error;
}