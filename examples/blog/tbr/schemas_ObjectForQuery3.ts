import { Clone, type Static, Type } from '@sinclair/typebox';
import { GenericDtSchema } from './schemas_GenericDt.js';

export const ObjectForQuery3Schema = Type.Object({
	s3Prop1: Type.String(),
	s3Prop2: Type.Optional(Clone(GenericDtSchema)),
});
export type ObjectForQuery3 = Static<typeof ObjectForQuery3Schema>;
