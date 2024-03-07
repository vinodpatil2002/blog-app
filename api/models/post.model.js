import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://i.pinimg.com/originals/45/55/11/455511b1b8d9937bb193fa4125bf1be5.jpg"
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
    
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
