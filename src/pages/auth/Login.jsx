import React from 'react'
import {Login as LoginComponent} from "../../components"
import { Link } from 'react-router'

function Login() {
  return (
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
      <LoginComponent/>
    </div>
  )
}

export default Login