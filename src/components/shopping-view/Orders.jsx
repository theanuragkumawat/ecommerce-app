import React, { useEffect, useState } from 'react'

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
import ShoppingOrderDetailsView from './ShoppingOrderDetailsView'
import databaseService from '@/appwrite/config'
import { useDispatch, useSelector } from 'react-redux'
import { addOrdersToState } from '@/store/shop/order-slice'
function Orders() {
  const dispatch = useDispatch()
  const {userData} = useSelector(state => state.auth)
  const {orders} = useSelector(state => state.order)
  const {currency} = useSelector(state => state.shopProducts)

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
  // const [currentOrders,setCurrentOrders] = useState([])
  const [openOrderDeatils, setOpenOrderDeatils] = useState(false)
  const [addressData,setAddressData] = useState({})
  async function getOrders() {
    try {
      const data = await databaseService.getAllOrders(userData.$id)
      if(data){
        dispatch(addOrdersToState(data.documents))
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(userData?.$id){
      getOrders()
    }
  },[userData])


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
          {orders.map((invoice) => (
            <TableRow key={invoice.$id}>
              <TableCell className="font-medium">{invoice.$id}</TableCell>
              <TableCell>{invoice.orderDate}</TableCell>
              <TableCell>{invoice.orderStatus}</TableCell>
              <TableCell className="">{currency}{invoice.totalAmount}</TableCell>
              <TableCell className="text-right">
                <Dialog open={openOrderDeatils} onOpenChange={() => setOpenOrderDeatils(false)}>
                  <Button onClick={() => setOpenOrderDeatils(true)}>View Details</Button>
                  <ShoppingOrderDetailsView orderDetails={invoice}/>
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