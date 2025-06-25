import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { UserSchema } from './schemas_User.ts';


export const GetUsersByQuery200ResponseSchema = Type.Array(Clone(UserSchema))
export type GetUsersByQuery200Response = Static<typeof GetUsersByQuery200ResponseSchema>
