// import React from 'react'

import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
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
            <form className="flex flex-col gap-4" >
              <div className="">
                <Label value="Your username" className="text-sm">Username</Label>
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username" 
                />
              </div>
              <div className="">
                <Label value="Your email" className="text-sm"/>
                <TextInput
                  type="email"
                  placeholder="Email Id"
                  id="email" 
                />
              </div>
              <div className="">
                <Label value="Your password" className="text-sm"/>
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password" 
                />
              </div>
              <Button gradientDuoTone='purpleToPink' type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
            <span className="flex gap-2 text-sm mt-5">
              Already have an account? 
              <Link to={'/sign-in'} className="text-purple-500"> Sign In</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
