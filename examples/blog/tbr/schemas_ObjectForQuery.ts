import { Clone, type Static, Type } from '@sinclair/typebox';
import { GenericDtSchema } from './schemas_GenericDt.ts';

export const ObjectForQuerySchema = Type.Object({
	s1Prop1: Type.Optional(Type.String()),
	s1Prop2: Type.Optional(Clone(GenericDtSchema)),
});
export type ObjectForQuery = Static<typeof ObjectForQuerySchema>;
