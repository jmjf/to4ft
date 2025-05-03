import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const PetBodySchema = Type.Object({"petId": Type.Optional(Type.String()),
"petName": Type.Optional(Type.String())})
export type PetBody = Static<typeof PetBodySchema>
