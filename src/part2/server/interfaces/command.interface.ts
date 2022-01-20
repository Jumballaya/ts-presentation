import { CollectionCommand } from "./collection-command.interface";
import { EntryCommand } from "./entry-command.interface";

export interface Command {
  collection?: CollectionCommand;
  entry?: EntryCommand;
}