import { Clone, type Static } from '@sinclair/typebox';
import { PostSchema } from './schemas_Post.ts';

export const TestMultiMediaResponseSchema = Clone(PostSchema);
export type TestMultiMediaResponse = Static<typeof TestMultiMediaResponseSchema>;
