import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { UserIdSchema } from './schemas_UserId.ts';
import { UserNmSchema } from './schemas_UserNm.ts';
import { EmailAddrTxSchema } from './schemas_EmailAddrTx.ts';
import { X_DashesSchema } from './schemas_x-dashes.ts';
import { $100OkSchema } from './schemas_$100ok.ts';
import { X𒐗Schema } from './schemas_x𒐗.ts';
import { TestBooleanSchema } from './schemas_TestBoolean.ts';


export const UserSchema = Type.Object({"userId": Clone({...UserIdSchema, ...{"description":"A unique identifier for a user (override)"}}),
"userNm": Clone(UserNmSchema),
"emailAddrTx": Type.Optional(Clone(EmailAddrTxSchema)),
"x-dashes": Type.Optional(Clone(X_DashesSchema)),
"$100ok": Type.Optional(Clone($100OkSchema)),
"x𒐗": Type.Optional(Clone(X𒐗Schema)),
"testBoolean": Type.Optional(Clone(TestBooleanSchema)),
"testUnionType": Type.Optional(Type.Union([ Type.String(),
 Type.Number(),
 Type.Null(),
 Type.Unknown(),
 Type.Array(Type.Unknown())]))}, {"title":"User"})
export type User = Static<typeof UserSchema>
