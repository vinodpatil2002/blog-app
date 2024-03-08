// import React from 'react'

import { Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from "react-redux"
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import { FaCheck, FaCross, FaTimes } from "react-icons/fa";
import { set } from "mongoose";

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [commentId , setCommentId] = useState('');
    // console.log(userPosts);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                if(res.ok){
                    setComments(data.comments);
                    if(data.comments.length < 9){
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchComments();
        }
}, [currentUser._id]);

const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
        const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
        const data = await res.json();
        if(res.ok){
            setComments((prev) => [...prev, ...data.comments]);
            if(data.comments.length < 9){
                setShowMore(false);
            }
        }
    } catch (error) {
        console.error(error);
    }
};
const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentId}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


    return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar scrollbar-track-slate-700 scrollbar-thumb-slate-800">
        {currentUser.isAdmin && comments.length > 0 ? (
            <>
                <Table hoverable className="shadow-md" >
                    <Table.Head>
                        <Table.HeadCell>Date Updated</Table.HeadCell>
                        <Table.HeadCell>Comment content</Table.HeadCell>
                        <Table.HeadCell>Number of likes</Table.HeadCell>
                        <Table.HeadCell>Post Id</Table.HeadCell>
                        <Table.HeadCell>User Id</Table.HeadCell>
                        <Table.HeadCell>
                            <span>
                                Delete
                            </span>
                        </Table.HeadCell>
                    </Table.Head>
                    {comments.map((comment) => (
                        <Table.Body key={comment._id} className="divide-y">
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString() }</Table.Cell>
                            <Table.Cell>
                                {comment.content} 
                            </Table.Cell>
                            <Table.Cell>
                                {comment.numberOfLikes}
                            </Table.Cell>
                            <Table.Cell>{comment.postId}</Table.Cell>
                            <Table.Cell>
                                <Link to={`/user/${comment.userId}`}>{comment.userId}</Link>
                            </Table.Cell>
                            <Table.Cell>
                                <button type="button" className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded-md" onClick={() => {
                                    setShowModal(true);
                                    setCommentId(comment._id);

                                } }>Delete</button>
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
            <p>You have no comments yet</p>
        )}
        <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
