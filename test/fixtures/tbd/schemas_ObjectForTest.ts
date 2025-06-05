import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const ObjectForTestSchema = Type.Object({"s1Prop1": Type.String(),
"s1Prop2": Type.Optional(Type.String({"minLength":3}))})
export type ObjectForTest = Static<typeof ObjectForTestSchema>
