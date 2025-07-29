import React, { useEffect, useState } from 'react';
import { Home, ShoppingBag, Star, RotateCcw, Settings, LogOut, ShoppingCart, Repeat, Heart, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import authService from '@/appwrite/auth';
import { addProductsToCart } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { logout } from '@/store/auth-slice';
import { Link } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import databaseService from '@/appwrite/config';



const ShoppingAccount = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const { userData, isAuthenticated } = useSelector(state => state.auth)
  const { wishlistItems } = useSelector(state => state.wishlist)
  const [userReviews, setUserReviews] = useState([]);
  const dispatch = useDispatch()
  const navItems = [
    { name: 'Overview', icon: Home },
    { name: 'Settings', icon: Settings },
  ];

  const [openDialog, setOpenDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Something went wrong')

  const OverviewCard = ({ icon: Icon, title, subtitle }) => (
    <Card className="flex flex-col items-center p-4  rounded-lg  w-full  min-w-[120px]">
      <Icon className="w-8 h-8 text-gray-900 mb-2" />
      <h3 className="text-xl font-semibold text-gray-900 text-center">{title}</h3>
      <p className="text-sm text-gray-900 text-center">{subtitle}</p>
    </Card>

  );
  
  const initialDatils = {
    oldPassword:"",
    newPassword:"",
    retypeNewPassword:"",
  }

  const [passwordDetails,setPasswordDetails] = useState(initialDatils)

  console.log(passwordDetails);
  async function handleChangePassword() {
    setErrorMessage('')
    try {
      const data = await authService.changePassword(passwordDetails)
      if(data){
        toast.success("Pasword change successfully")
        setOpenDialog(false)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  // get user reviews
  async function getUserReviews() {
    try {
      const data = await databaseService.getUserReviews(userData?.$id)
      if (data) {
        setUserReviews(data.documents);
      }
    } catch (error) {
      console.log('Failed to fetch user reviews')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getUserReviews();
    }
  }, [isAuthenticated]);

  async function handleLogout() {
    if (!isAuthenticated) {
      return
    }
    const data = await authService.logout()
    if (data) {
      dispatch(logout())
      dispatch(addProductsToCart([]))
      toast.success('Logout successfully')
    }
  }

  return (
    <div className='container mx-auto'>
      <div className=" rounded-xl  flex flex-col lg:flex-row w-full ">
        {/* Sidebar Navigation */}

        <div className="w-full lg:w-1/4  p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900">My account</h1>
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h1 className="hidden lg:block text-2xl font-bold text-gray-900 mb-6">My account</h1>
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveTab(item.name)}
                    className={`flex items-center w-full p-3 rounded-lg text-left transition-all duration-100
                      ${activeTab === item.name ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-900 hover:bg-gray-900 hover:text-white'}`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-lg">{item.name}</span>
                  </button>
                </li>
              ))}
              <li >
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-all duration-100'text-gray-900 hover:bg-gray-900 hover:text-white`}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="text-lg">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto ">
          {activeTab === 'Overview' && (
            <>
              <Card className="mb-8 p-4  rounded-lg shadow-md text-gray-900">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome, {userData?.name}</h2>
                  <p className="text-gray-900">Email: {userData?.email}</p>
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-4 mb-8 justify-center">
                <OverviewCard icon={ShoppingCart} title={`${userData?.totalOrders ? userData?.totalOrders : "0"} orders`} subtitle="Total orders" />
                <OverviewCard icon={MessageSquare} title={`${userReviews?.length > 0 ? userReviews.length : "0"} reviews`} subtitle="Total reviews" />
                <OverviewCard icon={Heart} title={`${wishlistItems?.length ? wishlistItems?.length : "0"} products`} subtitle="Favorite products" />
              </div>
            </>
          )}

          {activeTab === 'Settings' && (
            <Card>
              <div className="text-gray-900 p-10  rounded-lg ">
                <h2 className="text-3xl font-bold mb-4">Account Settings</h2>
                <p className="text-lg text-gray-600 mb-4">Manage your account preferences and security.</p>
                <div className="flex flex-col space-y-2">
                    <p onClick={() => setOpenDialog(true)} className="text-start cursor-pointer text-neutral-900 hover:underline font-semibold text-md">
                      Change Password?
                    </p>
                  <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                   
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={"text-2xl"}>Change password</DialogTitle>
                        <DialogDescription>
                          <div className='mt-4 flex flex-col gap-3'>
                            <div className='relative'>
                              <Input name="oldPassword" onChange={(e) => setPasswordDetails((prev) => ({...prev,[e.target.name]: e.target.value}))} value={passwordDetails.oldPassword} className={'h-12'} placeholder="Current password">
                              </Input>
                            </div>
                            <Input name="newPassword"onChange={(e) => setPasswordDetails((prev) => ({...prev,[e.target.name]: e.target.value}))} value={passwordDetails.newPassword} className={'h-12'} placeholder="New password">
                            </Input>
                            <Input name="retypeNewPassword" onChange={(e) => setPasswordDetails((prev) => ({...prev,[e.target.name]: e.target.value}))} value={passwordDetails.retypeNewPassword} className={'h-12'} placeholder="Retype new password">
                            </Input>
                            {/* <Link className={"-mt-1 text-start cursor-pointer text-neutral-900 hover:underline font-semibold text-md"}>Forgot Password?</Link> */}
                            {/* error message */}
                            {
                              errorMessage && <p className='text-red-500 text-sm mt-2 text-center'>{errorMessage}</p>
                            }
                          </div>
                          <Button
                            className={'mt-4 w-full'}
                            onClick={handleChangePassword}
                          >
                            Change password
                          </Button>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                </div>
              </div>
            </Card>

          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
