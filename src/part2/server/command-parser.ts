import { Command } from "./interfaces/command.interface";
import { CommandType } from "./enums/command-types.enum";
import { CollectionCommand } from "./interfaces/collection-command.interface";
import { EntryCommand } from "./interfaces/entry-command.interface";

type KeyedObject = Command | CollectionCommand | EntryCommand;

const hasKey = (obj: KeyedObject | undefined, key: string): boolean => {
  if (obj) return key in obj;
  return false;
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