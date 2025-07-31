import React, { useState } from 'react'
import { Login as LoginComponent } from "../../components"
import { Link } from 'react-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ForgotPassword from '../../components/ForgotPassword'

function Login() {
  const [openDialog,setOpenDialog] = useState(false)
  
  return (
    <>
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className='text-center'>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="mt-2">
            Don't have an account
            <Link to="/register" className='font-medium ml-2 text-primary hover:underline'>
              Register
            </Link>
          </p>
        </div>
        <LoginComponent setOpenDialog={setOpenDialog} />
      </div>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <ForgotPassword setOpenDialog={setOpenDialog}/>
      </Dialog>
    </>
  )
}

export default Login