import {Sidebar} from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';



export default function DashSidebar() {
    const {currentUser} = useSelector(state => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const [tab , setTab] = useState();
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if(tabFromUrl){
            setTab(tabFromUrl);
        }
    // console.log(tabFromUrl);
  } , [location.search] );
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Sidebar className='w-full md:w-56' >
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to="/dashboard?tab=profile">
                    <Sidebar.Item as='div' active={tab === 'profile'} icon={HiUser} label={
                      currentUser.isAdmin ? 'Admin' : 'User'
                    } labelColor='dark'>
                        Profile
                    </Sidebar.Item>
                </Link>
                {
                  currentUser.isAdmin && (
                    <Link to="/dashboard?tab=posts">
                      <Sidebar.Item as='div' active={tab === 'posts'} icon={HiDocumentText}  labelColor='dark'>
                        Posts
                      </Sidebar.Item>
                  </Link>
                  )
                }
                {
                  currentUser.isAdmin && (
                    <Link to="/dashboard?tab=users">
                      <Sidebar.Item as='div' active={tab === 'users'} icon={HiOutlineUserGroup}  labelColor='dark'>
                        Users
                      </Sidebar.Item>
                  </Link>
                  )
                }
                
                <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign Out
                </Sidebar.Item> 
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
