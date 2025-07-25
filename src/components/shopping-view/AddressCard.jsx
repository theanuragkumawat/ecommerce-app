import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import databaseService from '@/appwrite/config'

function AddressCard({ addressData, getAllAddress,setaddressData,setIsEditing }) {

    async function remove() {
        try {
            const data = await databaseService.deleteAddress(addressData.$id)
            if (data) {
                getAllAddress()
            }
        } catch (error) {
            console.log(error);
        }

    }
   function edit() {
        setaddressData(addressData)
        setIsEditing(addressData.$id)
    }

    return (
        <Card className={'p-3 gap-4 w-xs sm:w-sm'}>
            <div className=''>
                <p className='font-semibold mb-0.5'>Address: {addressData.address}</p>
                <p className='font-semibold mb-0.5'>City: {addressData.city}</p>
                <p className='font-semibold mb-0.5'>Pincode: {addressData.pincode}</p>
                <p className='font-semibold mb-0.5'>Phone: {addressData.phone}</p>
              
                    
                    <p className='font-semibold'>Notes: {addressData.notes ? addressData.notes : ""}</p>
             
            </div>
            <div className='flex justify-between'>
                <Button onClick={edit}>Edit</Button>
                <Button onClick={remove}>Delete</Button>
            </div>
        </Card>
    )
}

export default AddressCard