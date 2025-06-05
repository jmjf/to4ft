import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { UserNmSchema } from './schemas_UserNm.ts';



export const ObjectForTestSchema = Type.Object({"s1Prop1": Type.String(),
"s1Prop2": Type.Optional(Clone(UserNmSchema))})
export type ObjectForTest = Static<typeof ObjectForTestSchema>
