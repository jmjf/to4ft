import { Clone, type Static, Type } from '@sinclair/typebox';
import { $100OkSchema } from './schemas_$100ok.js';
import { EmailAddrTxSchema } from './schemas_EmailAddrTx.js';
import { UserIdSchema } from './schemas_UserId.js';
import { UserNmSchema } from './schemas_UserNm.js';
import { X_DashesSchema } from './schemas_x-dashes.js';
import { X𒐗Schema } from './schemas_x𒐗.js';

export const UserSchema = Type.Object({
	userId: Clone(UserIdSchema),
	userNm: Clone(UserNmSchema),
	emailAddrTx: Type.Optional(Clone(EmailAddrTxSchema)),
	'x-dashes': Type.Optional(Clone(X_DashesSchema)),
	$100ok: Type.Optional(Clone($100OkSchema)),
	x𒐗: Type.Optional(Clone(X𒐗Schema)),
});
export type User = Static<typeof UserSchema>;
