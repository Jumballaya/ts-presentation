export enum CommandType {
  CollectionCreate = 'collection:create',
  CollectionRead = 'collection:read',
  CollectionUpdate = 'collection:update',
  CollectionDelete = 'collection:delete',

  EntryCreate = 'entry:create',
  EntryRead = 'entry:read',
  EntryUpdate = 'entry:update',
  EntryDelete = 'entry:delete',

  Error = 'error',
}