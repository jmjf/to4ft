import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { ObjectForTestSchema } from './schemas_ObjectForTest.ts';



export const TestResponseRefSchema = Type.Object({"res": Type.Optional(Clone(ObjectForTestSchema))})
export type TestResponseRef = Static<typeof TestResponseRefSchema>
