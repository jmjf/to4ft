import { type Static, Type } from '@sinclair/typebox';

export const tbGenericDt = Type.String({ format: 'date', example: '2024-03-05' });
export type TbGenericDt = Static<typeof tbGenericDt>;
