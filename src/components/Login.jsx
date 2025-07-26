import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import authService from "@/appwrite/auth";
import { login as storeLogin } from "../store/auth-slice"
import { toast } from "sonner"
import databaseService from "@/appwrite/config";
import { addProductsToCart } from "@/store/shop/cart-slice";

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [error, setError] = useState('')
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });
    // console.log(userDetails);

    async function handleLogin(e) {
        e.preventDefault();
        setError('')
        // console.log("clicked on login");
        try {
            const session = await authService.login(userDetails)
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    dispatch(storeLogin(userData))

                    const cart = await databaseService.getCart(userData.$id)
                    if(cart){
                        localStorage.removeItem('cart');
                    } else{
                        const tempCart = localStorage.getItem('cart')
                        if(tempCart){

                            const data = await databaseService.createCart(userData.$id,JSON.parse(tempCart))
                            if(data){
                                console.log(data);
                                
                                dispatch(addProductsToCart(JSON.parse(data.products)))
                                localStorage.removeItem('cart');
                            }
                        }
                    }
                    toast('Login successfull')
                    navigate('/')
                }
            }
        } catch (error) {
            setError(error.message)
        }
    }

    // async function logout() {
    //     const logoutDetails = await authService.logout()
    //     if (logoutDetails) {
    //         console.log(logoutDetails);

    //     }
    // }

    return (
        <>
            <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-3">
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
                            type="password"
                        />
                        {
                            error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>
                        }
                    </div>
                </div>
                <Button type="submit" className="mt-6 w-full cursor-pointer">
                    Submit
                </Button>
            </form>
        </>
    );
}

export default Login;
