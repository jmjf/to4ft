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
import { UserIdSchema } from './schemas_UserId.js';

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

export const AllOfOneOfQuerySchema = Type.Intersect([
	Type.Object({
		s2Prop1: Type.Optional(Type.Boolean()),
		s2Prop2: Type.Optional(Type.Union([Type.String({ format: 'date' }), Type.Date()])),
	}),
	OneOf([
		Clone(ObjectForQuerySchema),
		Clone(UserIdSchema),
		Type.Object({ oneOfProp1: Type.Optional(Type.String()), oneOfProp2: Type.Optional(Type.Number()) }),
	]),
]);
export type AllOfOneOfQuery = Static<typeof AllOfOneOfQuerySchema>;
