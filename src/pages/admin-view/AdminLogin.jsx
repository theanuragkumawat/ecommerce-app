import authService from '@/appwrite/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

function AdminLogin() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const [error, setError] = useState('')
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });


    async function handleLogin() {
        try {
            setError('')
            const logoutData = await authService.logout()
            if(logoutData){
                console.log(logoutData);
            }
            const session = await authService.login(userDetails)
            if(session){
                const userDetails = await authService.getCurrentUser()
                if(userDetails.email == "anurag.kmwt7851@gmail.com"){
                    navigate("/admin/dashboard")
                    toast.success('Login successfully',{richColors:true})
                } else {
                    const logoutData2 = await authService.logout()
                    setError("You are not an admin")
                }
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <>
            <div className='flex justify-center flex-col h-screen items-center mx-auto w-1/3'>
                <h1 className='font-bold text-3xl mb-5'>Admin login</h1>
                <div className='w-full'>
                    <div className="flex flex-col gap-1">
                        <div className="grid w-full gap-1.5">
                            <Label className="mb-1"></Label>
                            <Input
                                name="email"
                                value={userDetails.email}
                                onChange={(e) =>
                                    setUserDetails((prev) => ({
                                        ...prev,
                                        [e.target.name]: e.target.value,
                                    }))
                                }
                                placeholder="Enter your email"
                                type="email"
                            />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label className="mb-1"></Label>
                            <Input
                                name="password"
                                value={userDetails.password}
                                onChange={(e) =>
                                    setUserDetails((prev) => ({
                                        ...prev,
                                        [e.target.name]: e.target.value,
                                    }))
                                }
                                placeholder="Enter your password"
                                type={`${showPassword ? "text" : "password"}`}
                            />
                            <div className="flex flex-row justify-between">

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="ml-2 mt-1 pr-3 flex items-center text-sm leading-5 cursor-pointer font-medium  text-primary hover:underline"
                                >
                                    {showPassword ? 'Hide password' : 'Show password'}
                                </button>

                            </div>
                            {
                                error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>
                            }
                        </div>
                    </div>
                    <Button onClick={handleLogin} className="mt-6 w-full cursor-pointer">
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdminLogin