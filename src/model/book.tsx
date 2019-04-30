import { Record, RecordRelationship } from '@orbit/data';

export interface Book extends Record {
    attributes: {
      name: string;
      bookTypeId: number;
    };
    relationships?: {
      type: RecordRelationship;
      sets: RecordRelationship;
    };
  };
export default Book;