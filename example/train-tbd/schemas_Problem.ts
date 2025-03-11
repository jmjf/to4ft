import { type Static, Type } from '@sinclair/typebox';

export const ProblemSchema = Type.Object({
	type: Type.Optional(Type.String()),
	title: Type.Optional(Type.String()),
	detail: Type.Optional(Type.String()),
	instance: Type.Optional(Type.String()),
	status: Type.Optional(Type.Number()),
});
export type Problem = Static<typeof ProblemSchema>;
