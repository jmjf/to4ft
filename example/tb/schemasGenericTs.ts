import { type Static, Type, } from '@sinclair/typebox';

export const tbGenericTs = Type.String({
	description: 'Description not provided',
	format: 'date-time',
	example: '2024-01-02:03:04:05Z',
});
export type TbGenericTs = Static<typeof tbGenericTs>;
