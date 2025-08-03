import React from 'react'
import { Outlet } from 'react-router'
import ShoppingHeader from './ShoppingHeader'
import Footer from './Footer'

function ShopingLayout() {
    return (
        <div className='flex flex-col bg-white overflow-hidden '>
            {/* Header */}
            <ShoppingHeader />
            <main className="flex flex-col w-full">
                <Outlet />
            </main>
            <Footer/>
        </div>
    )
}

export default ShopingLayout