import { type Static, Type, } from '@sinclair/typebox';

export const tbPostTx = Type.String({ minLength: 1, maxLength: 1024, description: 'Contents of a post' });
export type TbPostTx = Static<typeof tbPostTx>;
