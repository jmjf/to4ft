import { Clone, type Static, Type } from '@sinclair/typebox';
import { UserSchema } from './schemas_User.ts';

export const GetUsersByQuery200ResponseSchema = Type.Array(Clone(UserSchema));
export type GetUsersByQuery200Response = Static<typeof GetUsersByQuery200ResponseSchema>;
