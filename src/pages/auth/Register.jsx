import React, { useState } from 'react'
import { Link } from 'react-router'
import {Register as RegisterComponent} from "../../components"
import { MailOpen } from 'lucide-react'
import databaseService from '@/appwrite/config'
function Register() {

  const [verifying,setVerifying] = useState(false)
  const [email,setEmail] = useState(false);


  return (
    !verifying ? (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className='text-center'>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link to="/login" className='font-medium ml-2 text-primary hover:underline'>
            Login
          </Link>
        </p>
      </div>
      <RegisterComponent setVerifying={setVerifying} setEmail={setEmail}/>
    </div>
    ) : (
      <div className='py-7 px-10 rounded-xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        <h3 className='text-center text-3xl font-semibold'>Confirm your email address</h3>
        <p className='text-center flex justify-center items-center mt-6 mb-6'> 
          <MailOpen size={50} className='w-2xs h-2xs' />
          </p>
        <p className='text-center font-semibold text-lg mb-3'>We sent an email to {email} </p>
        <p className='text-center text-md'>Please confirm your email address by clicking the link we just sent to your inbox</p>
      </div>
    )
  )
}

export default Register