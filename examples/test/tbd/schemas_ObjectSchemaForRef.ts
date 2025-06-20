import { type Static, Type } from '@sinclair/typebox';

export const ObjectSchemaForRefSchema = Type.Object({
	postId: Type.Number({ minimum: 1 }),
	postedTs: Type.Optional(Type.Unsafe<Date | string>(Type.String({ format: 'date-time' }))),
});
export type ObjectSchemaForRef = Static<typeof ObjectSchemaForRefSchema>;
