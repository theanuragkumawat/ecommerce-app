import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut } from 'lucide-react'
import authService from '@/appwrite/auth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'




function AdminHeader({setOpen}) {

    const navigate = useNavigate()

    const logout = async function(){
        const data = await authService.logout()
        if(data){
            console.log(data);
            
            toast('Logout successfully')
            navigate('/admin/login')
        }
    }

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
            
            <Button
            onClick={() => setOpen(true)}
            className="lg:hidden sm:block">
                <AlignJustify />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex flex-1 justify-end">
                <Button
                onClick={logout}
                className="cursor-pointer inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow">
                    <LogOut />
                    Logout
                </Button>
            </div>
        </header>
    )
}

export default AdminHeader