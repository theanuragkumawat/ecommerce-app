import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { Outlet } from 'react-router'

function AdminLayout() {
    const [openSideBar,setOpenSideBar] = useState(false)
    return (
        <div className='flex min-h-screen w-full '>
            {/* admin sidebar */}
            <AdminSidebar open={openSideBar} setOpen={setOpenSideBar}/>
            <div className='flex flex-1 flex-col'>
                {/* admin header */}
                <AdminHeader setOpen={setOpenSideBar}/>
                <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

        </div>
    )
}

export default AdminLayout