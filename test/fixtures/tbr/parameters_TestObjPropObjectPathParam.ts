import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const TestObjPropObjectPathParamSchema = Type.Object({"prop1": Type.Optional(Type.Array(Type.String()))})
export type TestObjPropObjectPathParam = Static<typeof TestObjPropObjectPathParamSchema>
