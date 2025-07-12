import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Store, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import authService from '@/appwrite/auth'
import { toast } from 'sonner'
import { logout as storeLogout } from "../../store/auth-slice"
import { Badge } from '../ui/badge'
import { getCartCount } from '@/store/shop/cart-slice'

function ShoppingHeader() {

  const navigate = useNavigate()
  const {userData,isAuthenticated} = useSelector(state => state.auth)
  const { cartCount, cartItems } = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const [showSmallScreenMenu, setShowSmallScreenMenu] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const navMenu = [
    {
      name: "Home",
      path: 'home'
    },
    {
      name: "Products",
      path: 'listing'
    },
    {
      name: "Men",
      path: 'listing'
    },
    {
      name: "Women",
      path: 'listing'
    },
    {
      name: "Kids",
      path: 'listing'
    },
    {
      name: "Footwear",
      path: 'listing'
    },
    {
      name: "Accessories",
      path: 'listing'
    },
    {
      name: "Search",
      path: '/search'
    },
  ]

  useEffect(() => {
    dispatch(getCartCount())
  }, [cartItems])

  const handleLogout = async function () {
    const data = await authService.logout()
    if (data) {
      console.log(data);
      dispatch(storeLogout())
      toast('Logout successfully')
      navigate('/login')
    }
  }

  return (

    <nav className="bg-white dark:bg-gray-800 ">
      <div className="max-w-screen-xl px-4 sm:mx-auto 2xl:px-0 pt-2 sm:py-3 border-gray-200 border-b">

        <div className="flex items-center justify-between">
          <div className="shrink-0">
            <Link
              to="/shop/home"
              className="flex justify-center items-center cursor-pointer w-auto h-8 dark:hidden text-lg font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
            >
              <Store className='inline mr-2 ' />Ecommerce
            </Link>
          </div>
          <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-7 py-3 sm:justify-center">
            {
              navMenu.map(item => {

                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      // className={({ isActive }) =>
                      //   `py-2 relative font-medium text-sm dark:text-white after:content-[''] after:absolute after:left-0 after:bottom-0.5 after:h-[2px] after:bg-black    dark:after:bg-white after:transition-all after:duration-300  ${isActive ? 'after:w-full text-black' : 'after:w-0 text-gray-700'}`
                      // }
                      className={
                        `hover:text-gray-950 py-2 relative font-medium text-sm dark:text-white after:content-[''] after:absolute after:left-0 after:bottom-0.5 after:h-[2px] after:bg-black    dark:after:bg-white after:transition-all after:duration-300 after:w-0 text-gray-700`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                )
              })
            }
          </ul>

          <div className="flex items-center lg:space-x-2 relative">
            
            <Link
              to="cart"
              id="myCartDropdownButton1"
              data-dropdown-toggle="myCartDropdown1"
              type="button"
              className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
            >
              <span className="sr-only">Cart</span>
              <svg
                className="w-7 h-7"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                />
              </svg>
              <Badge variant="default | outline | secondary | destructive" className="absolute w-5 h-5 top-0.5 left-6">{cartCount > 0 ? cartCount : "0"}</Badge>

            </Link>

            <button
              onClick={() => showAccountMenu ? setShowAccountMenu(false) : setShowAccountMenu(true)}
              id="userDropdownButton1"
              data-dropdown-toggle="userDropdown1"
              type="button"
              className="relative cursor-pointer inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
            >
              {/* <svg
                className="w-5 h-5 me-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth={2}
                  d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg> */}
              {
                isAuthenticated ?
                  (<Avatar className="mr-1">
                    <AvatarFallback className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-white font-extrabold">
                     
                        {userData?.name?.[0]?.toUpperCase() || "U"}
                
                    </AvatarFallback>
                  </Avatar>) : (<User />)
              }


              <div
                id="userDropdown1"
                className={` ${showAccountMenu ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0"} absolute transition-all duration-300 ease-in-out transform  top-10 z-10 w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white antialiased shadow dark:divide-gray-600 dark:bg-gray-700`}
              >
                <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                  <li>
                    <Link
                      to="account"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      My Account{" "}
                    </Link>
                  </li>
                  <li>
                    <Link

                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      My Orders{" "}
                    </Link>
                  </li>
                  <li>
                    <Link

                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Settings{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="wishlist"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      My Wishlist{" "}
                    </Link>
                  </li>
                  <li>
                    <Link

                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Delivery Addresses{" "}
                    </Link>
                  </li>
                  <li>
                    <Link

                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Billing Data{" "}
                    </Link>
                  </li>
                </ul>
                <div
                  onClick={handleLogout}
                  className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Link
                    className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Log Out{" "}
                  </Link>
                </div>
              </div>
            </button>

            <button
              onClick={() => showSmallScreenMenu ? setShowSmallScreenMenu(false) : setShowSmallScreenMenu(true)}
              type="button"
              data-collapse-toggle="ecommerce-navbar-menu-1"
              aria-controls="ecommerce-navbar-menu-1"
              aria-expanded="false"
              className="inline-flex lg:hidden items-center justify-center hover:bg-gray-100 rounded-md dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white"
            >
              <span className="sr-only">Open Menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="ecommerce-navbar-menu-1"
          className={`
    transition-all duration-300 ease-in-out transform block  absolute
    ${showSmallScreenMenu ? "opacity-100 scale-100  max-h-screen" : "opacity-0 scale-95  max-h-0 overflow-hidden"}
    bg-gray-50 dark:bg-gray-700 dark:border-gray-600 border border-gray-200 rounded-lg py-3 w-dvw px-4 left-0
  `}
        >

          <ul className="text-gray-900 dark:text-white text-sm font-medium space-y-3">
            <li>
              <Link

                className="hover:text-primary-700 dark:hover:text-primary-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link

                className="hover:text-primary-700 dark:hover:text-primary-500"
              >
                Best Sellers
              </Link>
            </li>
            <li>
              <Link

                className="hover:text-primary-700 dark:hover:text-primary-500"
              >
                Gift Ideas
              </Link>
            </li>
            <li>
              <Link

                className="hover:text-primary-700 dark:hover:text-primary-500"
              >
                Games
              </Link>
            </li>
            <li>
              <Link

                className="hover:text-primary-700 dark:hover:text-primary-500"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link

                className="hover:text-primary-700 dark:hover:text-primary-500"
              >
                Home &amp; Garden
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  )
}

export default ShoppingHeader