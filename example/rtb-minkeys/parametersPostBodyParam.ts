import { Clone, type Static } from '@sinclair/typebox';
import { tbPostRequestBody } from './requestBodiesPostRequestBody.js';

export const tbPostBodyParam = Clone(tbPostRequestBody);
export type TbPostBodyParam = Static<typeof tbPostBodyParam>;
