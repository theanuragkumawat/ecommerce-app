import { Box, LayoutDashboard, PackageSearch, UserPen } from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '../ui/sheet'

function AdminSidebar({ open, setOpen }) {

  const menuItems = [
    {
      name: 'Dashboard',
      path: "/admin/dashboard",
      icon: <LayoutDashboard />
    },
    {
      name: 'Products',
      path: "/admin/products",
      icon: <PackageSearch />
    },
    {
      name: 'Orders',
      path: "/admin/orders",
      icon: <Box />
    },
  ]

  const navigate = useNavigate()

  return (
    <Fragment>

      <Sheet open={open} onOpenChange={() => setOpen(false)} >
        <SheetContent side='left' className='w-64'>
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <UserPen size={25} />
                Admin Panel
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex-col flex gap-2">
              {
                menuItems.map((item) => {

                  return (
                    <div key={item.name}
                      onClick={() => {
                        navigate(item.path)
                        open ? setOpen(false) : null
                      }}
                      className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                      {item.icon}
                      <span>{item.name}</span>

                    </div>
                  )
                })
              }
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => navigate('/admin/dashboard')}
        >
          <UserPen size={25} />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <nav className="mt-8 flex-col flex gap-2">
          {
            menuItems.map((item) => {

              return (
                <div key={item.name}
                  onClick={() => navigate(item.path)}
                  className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                  {item.icon}
                  <span>{item.name}</span>

                </div>
              )
            })
          }
        </nav>
      </aside>
    </Fragment>
  )
}

export default AdminSidebar