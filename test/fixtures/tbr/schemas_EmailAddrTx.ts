import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const EmailAddrTxSchema = Type.String({"format":"email","description":"An email address","example":"joe@mailinator.com"})
export type EmailAddrTx = Static<typeof EmailAddrTxSchema>
