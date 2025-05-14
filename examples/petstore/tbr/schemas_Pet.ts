import { Clone, type Static, Type } from '@sinclair/typebox';
import { CategorySchema } from './schemas_Category.js';
import { TagSchema } from './schemas_Tag.js';

export const PetSchema = Type.Object({
	id: Type.Optional(Type.Number({ format: 'int64' })),
	name: Type.String(),
	category: Type.Optional(Clone(CategorySchema)),
	photoUrls: Type.Array(Type.String()),
	tags: Type.Optional(Type.Array(Clone(TagSchema))),
	status: Type.Optional(Type.Union([Type.Literal('available'), Type.Literal('pending'), Type.Literal('sold')])),
	nullableValue: Type.Optional(Type.String({ nullable: true })),
});
export type Pet = Static<typeof PetSchema>;
