import { Clone, type Static, Type } from '@sinclair/typebox';
import { UserIdSchema } from './schemas_UserId.js';
import { UserNmSchema } from './schemas_UserNm.js';

export const TestRequestSchema = Type.Object({
	req: Type.Optional(
		Type.Object({ userId: Type.Optional(Clone(UserIdSchema)), userNm: Type.Optional(Clone(UserNmSchema)) }),
	),
});
export type TestRequest = Static<typeof TestRequestSchema>;
