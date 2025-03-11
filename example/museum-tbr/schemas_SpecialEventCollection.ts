import { Clone, type Static, Type } from '@sinclair/typebox';
import { SpecialEventSchema } from './schemas_SpecialEvent.ts';

export const SpecialEventCollectionSchema = Type.Array(Clone(SpecialEventSchema));
export type SpecialEventCollection = Static<typeof SpecialEventCollectionSchema>;
