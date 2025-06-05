import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestResponseRefSchema = Type.Object({"res": Type.Optional(Type.Object({"s1Prop1": Type.String(),
"s1Prop2": Type.Optional(Type.String({"minLength":3}))}))})
export type TestResponseRef = Static<typeof TestResponseRefSchema>
