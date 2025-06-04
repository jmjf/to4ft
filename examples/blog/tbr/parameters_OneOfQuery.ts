import {
	Clone,
	Kind,
	type SchemaOptions,
	type Static,
	type TSchema,
	type TUnion,
	Type,
	TypeRegistry,
} from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { ObjectForQuerySchema } from './schemas_ObjectForQuery.js';
import { ObjectForQuery3Schema } from './schemas_ObjectForQuery3.js';

TypeRegistry.Set(
	'ExtendedOneOf',
	(schema: { oneOf: unknown[] }, value) =>
		schema.oneOf.reduce(
			(acc: number, schema: unknown) => acc + (Value.Check(schema as TSchema, value) ? 1 : 0),
			0,
		) === 1,
);

const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) =>
	Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf });

export const OneOfQuerySchema = OneOf([
	Clone(ObjectForQuerySchema),
	Clone(ObjectForQuery3Schema),
	Type.Object({ s2Prop1: Type.Boolean(), s2Prop2: Type.Optional(Type.String({ format: 'date' })) }),
]);
export type OneOfQuery = Static<typeof OneOfQuerySchema>;
