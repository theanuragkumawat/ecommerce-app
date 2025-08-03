import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSelector } from 'react-redux'

function AdminOrderDetailsView({orderDetails}) {

    const { currency } = useSelector(state => state.shopProducts)
    const cartItems = JSON.parse(orderDetails.cartItems)
    const addressDetails = JSON.parse(`${orderDetails.addressInfo}`)

    return (

        <DialogContent className="sm:max-w-[600px] h-[590px] 2xl:h-auto overflow-auto">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="font-medium text-xl">Order Details</div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="">Order ID</p>
                        <Label className={'font-normal'}>{orderDetails?.$id}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="">Order Date</p>
                        <Label className={'font-normal'}>{orderDetails?.orderDate}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="">Order Price</p>
                        <Label className={'font-normal'}>{currency}{orderDetails?.totalAmount}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="">Payment method</p>
                        <Label className={'font-normal'}>{orderDetails?.paymentMethod}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="">Payment Status</p>
                        <Label className={'font-normal'}>{orderDetails?.paymentStatus}</Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium text-xl">Products Details</div>
                        <ul className="grid gap-3">
                            {cartItems && cartItems.length > 0
                                ? cartItems.map((item,index) => (
                                    <li key={index} className="flex items-center justify-between">
                                        <span>Title: {item.title}</span>
                                        <span>Quantity: {item.quantity}</span>
                                        <span>Price: {currency}{item.price}</span>
                                    </li>
                                ))
                                : null}
                        </ul>
                    </div>
                </div>
                <Separator />

                <div className="grid gap-2">
                    <div className="font-medium text-xl">Shipping Info</div>
                    <div className="grid gap-2">
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-normal">Address</p>
                            <Label className={'font-normal'}>{addressDetails?.address}</Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-normal">City</p>
                            <Label className={'font-normal'}>{addressDetails?.city}</Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-normal">Pincode</p>
                            <Label className={'font-normal'}>{addressDetails?.pincode}</Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-normal">Phone</p>
                            <Label className={'font-normal'}>{addressDetails?.phone}</Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-normal">Notes</p>
                            <Label className={'font-normal'}>{addressDetails?.notes ? addressDetails?.notes : null}</Label>
                        </div>
                    </div>

                </div>
            </div>
        </DialogContent>

    )
}

export default AdminOrderDetailsView