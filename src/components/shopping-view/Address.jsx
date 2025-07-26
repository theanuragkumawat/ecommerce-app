import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { AddressCard } from '..'
import { useSelector, useDispatch } from 'react-redux'
import databaseService from '@/appwrite/config'
import { addAddress } from '@/store/shop/address-slice'
import { toast } from 'sonner'

function Address() {

  const dispatch = useDispatch()
  const { addressList } = useSelector(state => state.address)
  const { userData } = useSelector(state => state.auth)

  const initialDetails = {
    address: '',
    pincode: '',
    phone: '',
    notes: '',
    city: ''
  }

  async function getAllAddress() {
    if (userData) {
      const data = await databaseService.getAddress(userData.$id)
      if (data) {
        dispatch(addAddress(data.documents))
      }
    }
  }


  useEffect(() => {
    getAllAddress()
  }, [userData, dispatch])

  const [addressData, setaddressData] = useState(initialDetails)
  const [isEditing, setIsEditing] = useState(false)
  
  const create = async (e) => {
    e.preventDefault()
    console.log("click");

    try {
      if (isEditing) {
        const data = await databaseService.updateAddress({ ...addressData, userId: userData.$id },isEditing)
        if (data) {
          getAllAddress()
        }
         setIsEditing(false)
         toast("Address updated")
      } else {
        if(addressList.length >= 3){
          toast.error("You can add max 3 addresses",{})
          return
        }
        const data = await databaseService.createAddress({ ...addressData, userId: userData.$id })
        if (data) {
          dispatch(addAddress(data))
          toast("Address added")
        }
      }
      setaddressData(initialDetails)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className='flex flex-col items-center sm:flex-row gap-3 '>
        {
          addressList?.map(item => (
            <AddressCard key={item.$id} addressData={item} getAllAddress={getAllAddress} setaddressData={setaddressData} setIsEditing={setIsEditing} />
          ))
        }
      </div>
      <form onSubmit={create}>
        <div className="flex flex-col gap-3 mt-12">
          <h2 className='text-2xl font-semibold mb-1'>{isEditing ? "Edit Address" : "Add New Address"}</h2>
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">Address:</Label>
            <Input placeholder="Enter your address"
              value={addressData.address}
              onChange={(e) => setaddressData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              type="text"
              name="address" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">City:</Label>
            <Input placeholder="Enter your city"
              value={addressData.city}
              onChange={(e) => setaddressData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              type="text"
              name="city" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">Pincode:</Label>
            <Input placeholder="Enter your pincode"
              value={addressData.pincode}
              onChange={(e) => setaddressData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              type="text"
              name="pincode" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">Phone:</Label>
            <Input placeholder="Enter your phone"
              value={addressData.phone}
              onChange={(e) => setaddressData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              type="text"
              name="phone" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">Notes(optional):</Label>
            <Input placeholder="Enter any additional details"
              value={addressData.notes}
              onChange={(e) => setaddressData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              type="text"
              name="notes" />
          </div>

        </div>
        <div className='flex justify-center'>
          <Button
            type="submit"
            className="mt-6 md:w-1/4 lg:w-1/5 2xl:w-1/3 cursor-pointer"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Address