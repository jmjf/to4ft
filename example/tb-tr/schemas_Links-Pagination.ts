import { type Static, Type } from '@sinclair/typebox';

export const Links_PaginationSchema = Type.Object({
	next: Type.Optional(Type.String({ format: 'uri' })),
	prev: Type.Optional(Type.String({ format: 'uri' })),
});
export type Links_Pagination = Static<typeof Links_PaginationSchema>;
