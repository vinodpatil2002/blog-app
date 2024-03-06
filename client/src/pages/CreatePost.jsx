import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post </h1>
        <form className='gap-4 flex flex-col'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput label='Title' name='title' type='text' placeholder='Enter title' required id='title' className='flex-1 ' />
                <Select label='Category' name='category' id='category' required className='flex-1'>
                    <option value='uncategorized'>Select a category</option>
                    <option value='javascript'>Javascript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='computervision'>Computer Vision</option>
                    <option value='datastructures'>Data Structures</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type='file' accept='img/*'/> 
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline>Upload Image </Button>
            </div>
            <ReactQuill className='h-72 mb-12 ' theme='snow' placeholder='Write something amazing...' required />
            <Button type='submit' gradientDuoTone='purpleToPink' size='lg' outline>Create Post</Button>
        </form>
    </div>
  )
}
