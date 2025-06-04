import { Clone, type Static, Type } from '@sinclair/typebox';
import { GenericDtSchema } from './schemas_GenericDt.js';

export const ObjectForQuerySchema = Type.Object({
	s1Prop1: Type.String(),
	s1Prop2: Type.Optional(Clone(GenericDtSchema)),
});
export type ObjectForQuery = Static<typeof ObjectForQuerySchema>;
