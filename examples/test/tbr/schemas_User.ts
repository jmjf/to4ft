import { Clone, type Static, Type } from '@sinclair/typebox';
import { $100OkSchema } from './schemas_$100ok.ts';
import { EmailAddrTxSchema } from './schemas_EmailAddrTx.ts';
import { TestBooleanSchema } from './schemas_TestBoolean.ts';
import { UserIdSchema } from './schemas_UserId.ts';
import { UserNmSchema } from './schemas_UserNm.ts';
import { X_DashesSchema } from './schemas_x-dashes.ts';
import { X𒐗Schema } from './schemas_x𒐗.ts';

export const UserSchema = Type.Object({
	userId: Clone(UserIdSchema),
	userNm: Clone(UserNmSchema),
	emailAddrTx: Type.Optional(Clone(EmailAddrTxSchema)),
	'x-dashes': Type.Optional(Clone(X_DashesSchema)),
	$100ok: Type.Optional(Clone($100OkSchema)),
	x𒐗: Type.Optional(Clone(X𒐗Schema)),
	testBoolean: Type.Optional(Clone(TestBooleanSchema)),
	testUnionType: Type.Optional(
		Type.Union([Type.String(), Type.Number(), Type.Null(), Type.Unknown(), Type.Array(Type.Unknown())]),
	),
});
export type User = Static<typeof UserSchema>;
