import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import AdminOrderDetailsView from '@/components/admin-view/AdminOrderDetailsView'
import databaseService from '@/appwrite/config'
import { useSelector } from 'react-redux'

function Orders() {

  const { currency } = useSelector(state => state.shopProducts)
  // const [status,setStatus] = useState('')

  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]
  const [openOrderDeatils, setOpenOrderDeatils] = useState(false)
  const [orders, setOrders] = useState([])

  async function getAllOrders() {
    try {
      const data = await databaseService.getAllAdminOrders()
      setOrders(data.documents)
    } catch (error) {
      console.log(error);

    }
  }

 async function changeOrderStatus(status,id){
    try {
      console.log(status);
      const data = await databaseService.updateOrder(status,id)
      if(data){
        console.log(data);
        getAllOrders()
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllOrders()
  }, [])

  return (
    <div className='text-orange-6s00'>
      <h1 className='font-semibold text-xl sm:mt-1 sm:mb-3'>Order History</h1>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead className="">Order Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((invoice) => (
            <TableRow key={invoice.$id}>
              <TableCell className="font-medium">{invoice.$id}</TableCell>
              <TableCell>{invoice.orderDate}</TableCell>
              <TableCell>
                <Select onValueChange={(value) => changeOrderStatus(value,invoice.$id)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={invoice.orderStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      <SelectItem value="pending">pending</SelectItem>
                      <SelectItem value="confirmed">confirmed</SelectItem>
                      <SelectItem value="shipped">shipped</SelectItem>
                      <SelectItem value="deliverd">deliverd</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </TableCell>
              <TableCell className="">{currency}{invoice.totalAmount}</TableCell>
              <TableCell className="text-right">
                <Dialog open={openOrderDeatils} onOpenChange={() => setOpenOrderDeatils(false)}>
                  <Button onClick={() => setOpenOrderDeatils(true)}>View Details</Button>
                  <AdminOrderDetailsView orderDetails={invoice} />
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </div>
  )
}

export default Orders