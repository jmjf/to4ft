import { Clone, type Static, Type } from '@sinclair/typebox';
import { CommentIdSchema } from './schemas_CommentId.js';
import { CommentTxSchema } from './schemas_CommentTx.js';
import { UserSchema } from './schemas_User.js';

export const CommentSchema = Type.Object({
	commentId: Clone(CommentIdSchema),
	commentTx: Clone(CommentTxSchema),
	commenter: Clone(UserSchema),
});
export type Comment = Static<typeof CommentSchema>;
