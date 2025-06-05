import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { ObjectForTestSchema } from './schemas_ObjectForTest.ts';



export const TestRequestRefSchema = Type.Object({"req": Type.Optional(Clone(ObjectForTestSchema))})
export type TestRequestRef = Static<typeof TestRequestRefSchema>
