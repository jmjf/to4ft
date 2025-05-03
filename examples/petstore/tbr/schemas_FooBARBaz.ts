import { type Static, Type } from '@sinclair/typebox';

export const FooBARBazSchema = Type.String();
export type FooBARBaz = Static<typeof FooBARBazSchema>;
