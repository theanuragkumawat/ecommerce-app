import React from 'react'
import { Link } from 'react-router'
import {Register as RegisterComponent} from "../../components"

function Register() {
  return (
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
      <RegisterComponent/>
    </div>
  )
}

export default Register