import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const UsersSchema = Type.Array(Type.Object({"userId": Type.Number({"minimum":1}),
"userNm": Type.String({"minLength":3}),
"emailAddrTx": Type.Optional(Type.String({"format":"email"})),
"x-dashes": Type.Optional(Type.String()),
"$100ok": Type.Optional(Type.String()),
"x𒐗": Type.Optional(Type.Number())}))
export type Users = Static<typeof UsersSchema>
