import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const EmailAddrTxSchema = Type.String({"format":"email"})
export type EmailAddrTx = Static<typeof EmailAddrTxSchema>
