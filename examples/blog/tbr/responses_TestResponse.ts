import { Clone, type Static, Type } from '@sinclair/typebox';
import { UserIdSchema } from './schemas_UserId.js';
import { UserNmSchema } from './schemas_UserNm.js';

export const TestResponseSchema = Type.Object({
	res: Type.Optional(
		Type.Object({ userId: Type.Optional(Clone(UserIdSchema)), userNm: Type.Optional(Clone(UserNmSchema)) }),
	),
});
export type TestResponse = Static<typeof TestResponseSchema>;
