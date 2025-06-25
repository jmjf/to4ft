import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";

TypeRegistry.Set('ExtendedOneOf', (schema: {oneOf: unknown[]}, value) => 1 === schema.oneOf.reduce((acc: number, schema: unknown) => acc + (Value.Check(schema as TSchema, value) ? 1 : 0), 0))

export const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) => Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf })

