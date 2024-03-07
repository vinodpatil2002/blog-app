// import React from 'react'

import { Table } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from "react-redux"
import { Link } from "react-router-dom";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
    console.log(userPosts);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if(res.ok){
                    setUserPosts(data.posts);
                    if(data.posts.length < 9){
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts();
        }
}, [currentUser._id]);

const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
        const data = await res.json();
        if(res.ok){
            setUserPosts((prev) => [...prev, ...data.posts]);
            if(data.posts.length < 9){
                setShowMore(false);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

    return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar scrollbar-track-slate-700 scrollbar-thumb-slate-800">
        {currentUser.isAdmin && userPosts.length > 0 ? (
            <>
                <Table hoverable className="shadow-md" >
                    <Table.Head>
                        <Table.HeadCell>Date Updated</Table.HeadCell>
                        <Table.HeadCell>Post Image</Table.HeadCell>
                        <Table.HeadCell>Post Title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                        <Table.HeadCell>
                            <span>
                                Edit
                            </span>
                        </Table.HeadCell>
                    </Table.Head>
                    {userPosts.map((post) => (
                        <Table.Body className="divide-y">
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>{new Date(post.updatedAt).toLocaleDateString() }</Table.Cell>
                            <Table.Cell>
                                <Link  to={`/post/${post.slug}`} target="_blank">
                                    <img src={post.image} alt={post.title} className="h-20 w-20 object-cover bg-gray-500" />
                                </Link>    
                            </Table.Cell>
                            <Table.Cell>
                            <Link className="font-semibold hover:underline text-gray-900 dark:text-white" to={`/post/${post.slug}`}  target="_blank">
                                {post.title}
                            </Link>
                                </Table.Cell>
                            <Table.Cell>{post.category}</Table.Cell>
                            <Table.Cell>
                                <button type="button" className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded-md" onClick={() => handleDelete(post._id)}>Delete</button>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`/updatepost/${post._id}`}  >
                                <button type="button" className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-md" onClick={() => handleEdit(post._id)}>Edit</button>
                                </Link>
                            </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
                {
                    showMore && (
                        <button type="button" className="w-full self-center bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 mt-4 rounded-md"onClick={handleShowMore} >Show More</button>
                    )
                }
            </>
        ) :(
            <p>You have no posts yet</p>
        )
        }
    </div>
  )
}
