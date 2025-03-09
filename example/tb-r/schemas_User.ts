import { Clone, type Static, Type } from '@sinclair/typebox';
import { $100okSchema } from './schemas_$100ok.ts';
import { EmailAddrTxSchema } from './schemas_EmailAddrTx.ts';
import { UserIdSchema } from './schemas_UserId.ts';
import { UserNmSchema } from './schemas_UserNm.ts';
import { x_dashesSchema } from './schemas_x-dashes.ts';
import { x𒐗Schema } from './schemas_x𒐗.ts';

export const UserSchema = Type.Object({
	userId: Clone(UserIdSchema),
	userNm: Clone(UserNmSchema),
	emailAddrTx: Type.Optional(Clone(EmailAddrTxSchema)),
	'x-dashes': Type.Optional(Clone(x_dashesSchema)),
	$100ok: Type.Optional(Clone($100okSchema)),
	x𒐗: Type.Optional(Clone(x𒐗Schema)),
});
export type User = Static<typeof UserSchema>;
