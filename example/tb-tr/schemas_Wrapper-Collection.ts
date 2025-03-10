import { type Static, Type } from '@sinclair/typebox';

export const Wrapper_CollectionSchema = Type.Object({
	data: Type.Optional(Type.Array(Type.Unknown())),
	links: Type.Optional(Type.Unknown({ readOnly: true })),
});
export type Wrapper_Collection = Static<typeof Wrapper_CollectionSchema>;
