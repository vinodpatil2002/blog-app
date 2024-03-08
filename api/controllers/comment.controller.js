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

export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({postId: req.params.postId})
        .sort({createdAt: -1});
        res.status(200).json(comments);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if(!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1) {
            comment.likes.push(req.user.id);
            comment.numberOfLikes += 1;
        } else {
            comment.likes.splice(userIndex, 1);
            comment.numberOfLikes -= 1;
        }
        await comment.save();
        res.status(200).json(comment);
        
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        if(req.user.id !== comment.userId && !req.user.isAdmin) {
            return next(errorHandler(401, 'Unauthorized'));
        }
        const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, {content: req.body.content}, {new: true});
        res.status(200).json(updatedComment);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        if(req.user.id !== comment.userId && !req.user.isAdmin) {
            return next(errorHandler(401, 'Unauthorized'));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment deleted');

    } catch (error) {
        next(errorHandler(500, error.message));
    }
};