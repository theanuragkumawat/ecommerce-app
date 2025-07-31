import authService from '@/appwrite/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

function RecoverAccount() {
    const navigate = useNavigate()
    
    const initialUserDetails = {
        password: "",
        repeatPassword: ""
    }

    const urlParams = new URLSearchParams(window.location.search)
    const secret = urlParams.get('secret')
    const userId = urlParams.get('userId')

    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [userDetails, setUserDetails] = useState(initialUserDetails)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            const data = await authService.updatePasswordRecover(userDetails, userId, secret);
            if (data) {
                // console.log(data);
                setUserDetails(initialUserDetails)
                toast.success("Password updated", {
                    description: "Please login to continue",
                    position: 'top-center',
                    richColors: true,
                    duration: 10000
                })
                navigate('/login')
            }
        } catch (error) {
            console.log(error);
            setError(error.message)
        }
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className='text-center'>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Recover your account
                </h1>
                <p className="mt-2">
                    Don't have an account
                    <Link to="/register" className='font-medium ml-2 text-primary hover:underline'>
                        Register
                    </Link>
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">

                    <div className="grid w-full gap-1.5">
                        <Label className=""></Label>
                        <Input
                            placeholder="Enter new password"
                            value={userDetails.password}
                            onChange={(e) => setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            type={`${showPassword ? "text" : "password"}`}
                            name="password"
                        />
                    </div>
                    <div className="grid w-full gap-1.5">
                        <Label className=""></Label>
                        <Input
                            placeholder="Repeat new password"
                            value={userDetails.repeatPassword}
                            onChange={(e) => setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            type={`${showPassword ? "text" : "password"}`}
                            name="repeatPassword"
                        />
                        {/* <button
                            type="button" // Important: set type to button to prevent form submission
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="ml-2 mt-1 pr-3 flex items-center text-sm leading-5 cursor-pointer font-medium text-primary hover:underline"
                        >
                            {showPassword ? 'Hide password' : 'Show password'}
                        </button> */}
                        {
                            error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>
                        }
                    </div>
                </div>
                <Button

                    type="submit"
                    className="mt-6 w-full cursor-pointer"
                >
                    Recover account
                </Button>
            </form>
        </div>
    )
}

export default RecoverAccount