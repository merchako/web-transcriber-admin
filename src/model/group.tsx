import { Record, RecordRelationship } from '@orbit/data';

export interface Group extends Record {
    attributes: {
      name: string;
      abbreviation: string;
    };
    relationships?: {
      owner: RecordRelationship;
      users: RecordRelationship;
    };
  };
export default Group;
