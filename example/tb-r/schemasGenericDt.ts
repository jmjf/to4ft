import { type Static, Type } from '@sinclair/typebox';

export const tbGenericDt = Type.String({ format: 'date' });
export type TbGenericDt = Static<typeof tbGenericDt>;
