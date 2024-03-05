// import React from 'react'

import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
// import { set } from "mongoose";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData , setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.password){
      return setErrorMessage("All fields are required");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    const data = res.json();
    if(data.success === false){
      return setErrorMessage(data.message);
    }
    setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10 ">
        <div className="flex-1">
          {/* Left side  */}
          <Link className=" font-bold dark:text-white text-4xl" to={"/"}>
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Vinod's</span>
            Blog
        </Link>
        <p className="text-sm mt-5">
          This is a demo blog app. You can sign up and create your own blog posts.
        </p>
        </div>
        <div className="flex-1">
          {/* Right side  */}
          <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" >
              <div className="">
                <Label value="Your username" className="text-sm">Username</Label>
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username" 
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <Label value="Your password" className="text-sm"/>
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password" 
                  onChange={handleChange}
                />
              </div>
              <Button disabled={loading} gradientDuoTone='purpleToPink' type="submit" className="w-full">
                {
                  loading ? (<>
                    <Spinner size='sm' color='white'/> 
                    <span className="pl-3">Loading...</span>
                    </>
                  ) : "Sign In"
                }
              </Button>
            </form>
            <span className="flex gap-2 text-sm mt-5">
              Don't have an account? 
              <Link to={'/sign-up'} className="text-purple-500"> Sign Up</Link>
            </span>
          </div>
          {
            errorMessage && <Alert color='failure' className="mt-5">{errorMessage}</Alert>
          }
        </div>
      </div>
    </div>
  )
}
