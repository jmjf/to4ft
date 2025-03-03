import { Clone, type Static } from '@sinclair/typebox';
import { tbPostBody } from './schemasPostBody.js';

export const tbPostRequestBody = Clone(tbPostBody);
export type TbPostRequestBody = Static<typeof tbPostRequestBody>;
