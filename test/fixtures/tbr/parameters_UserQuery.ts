import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { UserIdSchema } from './schemas_UserId.ts';
import { UserNmSchema } from './schemas_UserNm.ts';



export const UserQuerySchema = Type.Object({"userId": Clone(UserIdSchema),
"userNm": Clone(UserNmSchema),
"inline": Type.Optional(Type.String({"minLength":1,"description":"an inline property"}))}, {"title":"UserQuery","description":"this description will not be preserved"})
export type UserQuery = Static<typeof UserQuerySchema>
