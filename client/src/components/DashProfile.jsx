// import React from 'react'
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { updateFailure,updateStart,updateSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess, signOutSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import {useSelector} from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom';
// import { set } from 'mongoose';
// import { set } from 'mongoose';

export default function DashProfile() {
    const dispatch = useDispatch();
    const {currentUser, error, loading} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(0);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageFileUploadSuccess, setImageFileUploadSuccess] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal , setShowModal] = useState(false);

    // console.log(imageFileUploadingProgress);
    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImageFileUrl(URL.createObjectURL(file));
          setImageFile(file);
        }
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUploadSuccess(true);
        setImageFileUploadingError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadingProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadingError('Could not upload image(size must be more than 2MB)');
                setImageFileUploadingProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploadSuccess(false);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePicture: downloadURL});
                    setImageFileUploadSuccess(false);
                });
            }
        );

    };
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if(Object.keys(formData).length === 0){
            setUpdateUserError('No data to update');
            return;
        }
        if(imageFileUploadSuccess){
            return;
        }
        try {
          dispatch(updateStart());
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(updateFailure(data.message));
            setUpdateUserError(data.message);
          }
          else{
            dispatch(updateSuccess(data));
            setUpdateUserSuccess("User's profile updated successfully");
          }
        } catch (error) {
          dispatch(updateFailure('Something went wrong'));
          setUpdateUserError('Something went wrong');
        }
    }
    const handleDeleteUser = async () => {
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data.message));
        }
        else{
          dispatch(deleteUserSuccess(data));
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    };
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
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type="file" accept='img/*' onChange={handleImageChange} ref={filePickerRef} hidden />
            <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
            {imageFileUploadingError && <Alert color='failure'>{imageFileUploadingError}</Alert>}

            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}  onChange={handleChange}/>
            <TextInput type='password' id='password' placeholder='password'  onChange={handleChange} />
            <Button type='submit' gradientDuoTone='purpleToBlue'
              disabled={loading || imageFileUploadingProgress || imageFileUploadSuccess}
            outline >
              {loading ? 'Loading...' : 'Update'}
            </Button>
            {currentUser.isAdmin  && (
              <Link to={'/create-post'}>
                <Button type='button' gradientDuoTone='purpleToPink' outline className='w-full' >Create Post</Button>
              </Link> 
            )}
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span onClick={
                () => setShowModal(true)
            } className=''>Delete Account</span>
            <span onClick={handleSignOut} className=''>Sign Out</span>
        </div>
        {updateUserSuccess && <Alert color='success'>{updateUserSuccess}</Alert>}
        {updateUserError && <Alert color='failure'>{updateUserError}</Alert>}
        {error && <Alert color='failure'>{error}</Alert>}

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3>
                Are you sure you want to delete your account? This action cannot be undone.
              </h3>
              <div className="flex justify-center gap-5 mt-5">
                
                <Button color='failure' onClick={handleDeleteUser}>Yes I'm Sure</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No,  Cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    </div>
  )
}
