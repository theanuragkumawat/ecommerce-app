import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import databaseService from '@/appwrite/config'
import { useSelector } from 'react-redux'

function AddressCard({ addressData, getAllAddress, setaddressData, setIsEditing }) {
    const { addressList } = useSelector(state => state.address)

    async function remove(e) {
        e.stopPropagation();
        try {
            const data = await databaseService.deleteAddress(addressData.$id)
            if (data) {
                getAllAddress()
            }
        } catch (error) {
            console.log(error);
        }

    }
    function edit(e) {
        e.stopPropagation();
        setaddressData(addressData)
        setIsEditing(addressData.$id)
    }

    // async function handleDefault() {
    //     let existing = addressList.find((item) => item.isDefault == true)
    //     if (addressData.isDefault == false) {
    //         console.log("already selected");
    //         return
    //     } else {
    //         console.log("no same");

    //     }
    // }

    return (
        <Card  className={'p-3 gap-4 w-xs sm:w-sm'}>
            <div className=''>
                <p className='font-semibold mb-0.5'>Address: <span className='font-normal text-sm font-'>{addressData.address}</span></p>
                <p className='font-semibold mb-0.5'>City: <span className='font-normal text-sm font-'>{addressData.city}</span></p>
                <p className='font-semibold mb-0.5'>Pincode: <span className='font-normal text-sm font-'>{addressData.pincode}</span></p>
                <p className='font-semibold mb-0.5'>Phone: <span className='font-normal text-sm font-'>{addressData.phone}</span></p>
                <p className='font-semibold'>Notes: <span className='font-normal text-sm font-'>{addressData.notes ? addressData.notes : ""}</span></p>

            </div>
            <div className='flex justify-between'>
                <Button onClick={edit}>Edit</Button>
                <Button onClick={remove}>Delete</Button>
            </div>
        </Card>
    )
}

export default AddressCard