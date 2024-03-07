import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {app} from '../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
// import { set } from 'mongoose';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate,useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

export default function UpdatePost() {
    // const navigate = useNavigate();
    const [files , setFiles] = useState(null);
    const {currentUser} = useSelector((state) => state.user);
    const navigate = useNavigate();
    const {postId} = useParams();
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const [formData, setFormData] = useState({});
    

    useEffect(() => {
        try {
          const fetchPost = async () => {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();
            if (!res.ok) {
              console.log(data.message);
              setPublishError(data.message);
              return;
            }
            if (res.ok) {
              setPublishError(null);
              setFormData(data.posts[0]);
            }
          };
    
          fetchPost();
        } catch (error) {
          console.log(error.message);
        }
      }, [postId]);
    const handleUploadImage = async () => {
        try {
            if(!files) {
                setImageUploadError('Please select an image to upload');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + files.name;
            const storageRef = ref(storage, `images/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, files);
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({...formData, image: downloadURL});
                    });
                },
            );
        } catch (error) {
            setImageUploadError('image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if(!res.ok) {
                setPublishError(data.message);
                return;
            }
            if(res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError('Failed to create post');
        }
    }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update a post </h1>
        <form onSubmit={handleSubmit} className='gap-4 flex flex-col'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput label='Title' name='title' type='text' placeholder='Enter title' required id='title' className='flex-1 ' 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    value={formData.title}
                    />
                <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                 label='Category' name='category' id='category' required className='flex-1'>
                    <option value='uncategorized'>Select a category</option>
                    <option value='javascript'>Javascript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='computervision'>Computer Vision</option>
                    <option value='datastructures'>Data Structures</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type='file' accept='image/*' onChange={
                    (e) => {
                        setFiles(e.target.files[0])
                    }
                }/> 
                <Button disabled={imageUploadProgress} onClick={handleUploadImage} type='button' gradientDuoTone='purpleToBlue' size='sm' outline>
                    {
                        imageUploadProgress ? 
                        <div className='w-16 h-16'>
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0 }%`} />
                        </div>
                        :
                        'Upload Image'
                    }
                </Button>
            </div>
            {
                imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>
            }
            {
                formData.image && <img src={formData.image} alt='uploaded' className='w-full h-72 object-contain' />
            }
            <ReactQuill value={formData.content} className='h-72 mb-12 ' theme='snow' placeholder='Write something amazing...' required onChange={
                (value) => setFormData({...formData, content: value})
            } />
            <Button type='submit' gradientDuoTone='purpleToPink' size='lg' outline>Update </Button>
            {
                publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>
            }
        </form>
    </div>
  )
}
