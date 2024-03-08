import { useEffect, useState } from "react"
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from "react-redux";

export default function Comment({comment,onLike}) {
    const {currentUser} = useSelector(state => state.user);
    const [user, setUser] = useState({});
    console.log(user);
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
            getUser();
    },[comment])
  return (
    <div className="flex p-4 border-b dark:border-b-gray-600 text-sm"> 
        <div className="flex-shrink-0 mr-3">
            <img className="w-10 h-10 object-cover rounded-full bg-gray-200" src={user.profilePicture} alt={user.username} />
        </div>
        <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className="font-bold mr-1 text-sm truncate " >{user ? `@${user.username}` : 'Anonymous User'}</span>
                <span className="text-gray-500 text-xs">
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button type="button" onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${currentUser && 
                    comment.likes.includes(currentUser._id) ? 'text-blue-500' : ''
                } `}>
                    <FaThumbsUp className="text-sm"/>
                </button>
                <p className="text-gray-400">
                    {
                        comment.numberOfLikes > 0 && comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')
                    }
                </p>
            </div>
        </div>
    </div>
  )
}
