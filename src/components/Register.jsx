import React, { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import authService from "../appwrite/auth";
import { useNavigate } from "react-router";
import { toast } from "sonner"
import { useDispatch } from "react-redux";
import databaseService from "@/appwrite/config";
import { addProductsToCart } from "@/store/shop/cart-slice";

function Register({setEmail,setVerifying}) {
const dispatch = useDispatch()
    const navigate = useNavigate()

    const [error, setError] = useState('')
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
    });

    const create = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const userData = await authService.createAccount(userDetails)
            if (userData) {

                toast('Registration successful')
                setEmail(userDetails.email)
                const session = await authService.login(userDetails)
                if(session){
                    const tempCart = localStorage.getItem('cart')
                        if(tempCart){
                            const data = await databaseService.createCart(userData.$id,JSON.parse(tempCart))
                            if(data){
                                dispatch(addProductsToCart(JSON.parse(data.products)))
                                localStorage.removeItem('cart');
                            }
                        }
                    const verifyData = await authService.getVerification()
                    if(verifyData){
                        setVerifying(true)
                    }
                }
            }
        } catch (error) {
            setError(error.message)
            console.log("Signup error  " + error);
        }
    }

    console.log(userDetails);
    

    return (
        <form onSubmit={create}>
            <div className="flex flex-col gap-3">
                <div className="grid w-full gap-1.5">
                    <Label className="mb-1"></Label>
                    <Input placeholder="Enter a name"
                        value={userDetails.name}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        type="text"
                        name="name" />
                </div>
                <div className="grid w-full gap-1.5">
                    <Label className="mb-1"></Label>
                    <Input placeholder="Enter your email"
                        value={userDetails.email}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        type="email"
                        name="email" />
                </div>
                <div className="grid w-full gap-1.5">
                    <Label className=""></Label>
                    <Input
                        placeholder="Enter your password"
                        value={userDetails.password}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        type="password"
                        name="password"
                    />
                    {
                        error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>
                    }
                </div>
            </div>
            <Button

                type="submit"
                className="mt-6 w-full cursor-pointer"
            >
                Submit
            </Button>
        </form>
    );
}

export default Register;
