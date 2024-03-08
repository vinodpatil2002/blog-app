import express from 'express';
import { createComment,getPostComments,likeComment, editComment, deleteComment, getCommentSection } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken ,createComment);
router.get('/getPostComments/:postId',getPostComments);
router.put('/like/:commentId',verifyToken, likeComment);
router.put('/edit/:commentId',verifyToken, editComment);
router.delete('/deleteComment/:commentId',verifyToken, deleteComment);

router.get('/getcomments', verifyToken ,getCommentSection)



export default router;