import { Clone, type Static, Type } from '@sinclair/typebox';
import { $100OkSchema } from './schemas_$100ok.ts';
import { EmailAddrTxSchema } from './schemas_EmailAddrTx.ts';
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
});
export type User = Static<typeof UserSchema>;
