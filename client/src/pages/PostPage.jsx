import { Button, Spinner } from "flowbite-react";
import { set } from "mongoose";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";


export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);   
    const [post, setPost] = useState(null);
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if(!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                if(res.ok) {
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }

            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchPost();
    }, [postSlug]);

    if(loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size='xl' color='primary'/>
        </div>
    )
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
        <Link className="self-center mt-5" to={`/search?category=${post && post.category}`}>
            <Button color="gray" pill size='xs'>
                {post && post.category}
            </Button>
        </Link>
        <img className="mt-10 rounded p-3 max-h-[600px] w-full object-cover " src={post && post.image} alt={post && post.title} />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm">
            <span className="italic">{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{post && (post.content.length /1000).toFixed(0)}mins read </span>
        </div>
        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html:post && post.content}}>
        </div>
        <div className="max-w-4xl self-center max-auto w-full">
            <CallToAction />
        </div>
        <CommentSection postId={post && post._id} />
    </main>
  )
}
