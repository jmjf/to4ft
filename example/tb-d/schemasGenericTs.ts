import { type Static, Type } from '@sinclair/typebox';

export const tbGenericTs = Type.String({ format: 'date-time' });
export type TbGenericTs = Static<typeof tbGenericTs>;
