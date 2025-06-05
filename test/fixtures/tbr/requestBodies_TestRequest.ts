import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { UserIdSchema } from './schemas_UserId.ts';
import { UserNmSchema } from './schemas_UserNm.ts';



export const TestRequestSchema = Type.Object({"req": Type.Optional(Type.Object({"userId": Type.Optional(Clone(UserIdSchema)),
"userNm": Type.Optional(Clone(UserNmSchema))}))})
export type TestRequest = Static<typeof TestRequestSchema>
