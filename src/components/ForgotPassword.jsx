import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import databaseService from '@/appwrite/config'
import authService from '@/appwrite/auth'
import { toast } from 'sonner'

function ForgotPassword({setOpenDialog}) {
  const [userDetails, setUserDetails] = useState({
    email: ''
  })
  const [errorMessage, setErrorMessage] = useState('')
  // console.log(userDetails);

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    try {
      const data = await authService.createPasswordRecover(userDetails)
      if (data) {
        setOpenDialog(false)
        // console.log(data);
        toast.success("Recovery link has been sent", {
          description: "Please check your email to continue",
          position:'top-center',
          richColors:true,
          duration:10000
        })
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className={"text-2xl"}>Recover Account</DialogTitle>
        <DialogDescription>
          <form onSubmit={handleSubmit}>

            <div className='mt-4 flex flex-col gap-3'>
              <div className='relative'>
                <Input type={"email"} name="email" onChange={(e) => setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))} value={userDetails.email} className={'h-12'} placeholder="Enter your email">
                </Input>
              </div>

              {
                errorMessage && <p className='text-red-500 text-sm mt-2 text-center'>{errorMessage}</p>
              }
            </div>
            <Button
              className={'mt-4 w-full'}

            >
              Submit
            </Button>
          </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>


  )
}

export default ForgotPassword