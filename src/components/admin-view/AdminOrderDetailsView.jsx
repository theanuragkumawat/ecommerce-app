import { DialogContent } from '@/components/ui/dialog'
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

function AdminOrderDetailsView() {
    return (

        <DialogContent className="sm:max-w-[600px]">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex mt-6 items-center justify-between">
                        <p className="font-medium">Order ID</p>
                        <Label>orderDetails?._id</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Date</p>
                        <Label>orderDetails?.orderDate.split("T")[0]</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Price</p>
                        <Label>$orderDetails?.totalAmount</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Payment method</p>
                        <Label>orderDetails?.paymentMethod</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Payment Status</p>
                        <Label>orderDetails?.paymentStatus</Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            {/* {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                                ? orderDetails?.cartItems.map((item) => (
                                    <li className="flex items-center justify-between">
                                        <span>Title: {item.title}</span>
                                        <span>Quantity: {item.quantity}</span>
                                        <span>Price: ${item.price}</span>
                                    </li>
                                ))
                                : null} */}

                            <li className="flex items-center justify-between">
                                <span>Title: RJ best coat</span>
                                <span>Quantity: 5</span>
                                <span>Price: $051</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>user.userName</span>
                            <span>orderDetails?.addressInfo?.address</span>
                            <span>orderDetails?.addressInfo?.city</span>
                            <span>orderDetails?.addressInfo?.pincode</span>
                            <span>orderDetails?.addressInfo?.phone</span>
                            <span>orderDetails?.addressInfo?.notes</span>
                        </div>
                    </div>

                    <form>
                        <Label className="mb-2">Order Status</Label>
                        <Select >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </form>
                </div>
            </div>
        </DialogContent>

    )
}

export default AdminOrderDetailsView