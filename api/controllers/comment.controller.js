import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
    try {
        const {content, postId, userId} = req.body;
        if(userId !== req.user.id) {
            return next(errorHandler(401, 'Unauthorized'));
        }
        const newComment = new Comment({content, postId, userId});
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {  
        next(errorHandler(500, error.message));
    }
};