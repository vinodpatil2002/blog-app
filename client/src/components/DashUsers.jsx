// import React from 'react'

import { Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from "react-redux"
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import { FaCheck, FaCross, FaTimes } from "react-icons/fa";

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [userId , setUserId] = useState(null);
    // console.log(userPosts);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if(res.ok){
                    setUsers(data.users);
                    if(data.users.length < 9){
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }
}, [currentUser._id]);

const handleShowMore = async () => {
    const startIndex = users.length;
    try {
        const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
        const data = await res.json();
        if(res.ok){
            setUsers((prev) => [...prev, ...data.users]);
            if(data.users.length < 9){
                setShowMore(false);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

    return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar scrollbar-track-slate-700 scrollbar-thumb-slate-800">
        {currentUser.isAdmin && users.length > 0 ? (
            <>
                <Table hoverable className="shadow-md" >
                    <Table.Head>
                        <Table.HeadCell>Date Created</Table.HeadCell>
                        <Table.HeadCell>User Image</Table.HeadCell>
                        <Table.HeadCell>User name</Table.HeadCell>
                        <Table.HeadCell>Email id</Table.HeadCell>
                        <Table.HeadCell>Admin</Table.HeadCell>
                        <Table.HeadCell>
                            <span>
                                Delete
                            </span>
                        </Table.HeadCell>
                    </Table.Head>
                    {users.map((user) => (
                        <Table.Body key={user._id} className="divide-y">
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>{new Date(user.createdAt).toLocaleDateString() }</Table.Cell>
                            <Table.Cell>
                                    <img src={user.profilePicture} alt={user.username} className="h-10 w-10 object-cover rounded bg-gray-500" />   
                            </Table.Cell>
                            <Table.Cell>
                                {user.username}
                                </Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500"/>) :(<FaTimes
                            className="text-red-500"
                            />) }</Table.Cell>
                            <Table.Cell>
                                <button type="button" className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded-md" onClick={() => {
                                    setShowModal(true);
                                    setUserId(user._id);

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
            <p>You have no posts yet</p>
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
              Are you sure you want to delete this User?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure'>
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
