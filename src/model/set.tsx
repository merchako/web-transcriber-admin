import { Record, RecordRelationship } from '@orbit/data';

export interface Set extends Record {
    attributes: {
      name: string;
      bookId: number;
    };
    relationships?: {
      project: RecordRelationship;
      book: RecordRelationship;
      tasks: RecordRelationship;
    };
  };
export default Set;