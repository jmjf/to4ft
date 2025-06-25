import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const TestObjectPathParamSchema = Type.Object({"prop1": Type.Optional(Type.String()),
"prop2": Type.Optional(Type.Number())})
export type TestObjectPathParam = Static<typeof TestObjectPathParamSchema>
