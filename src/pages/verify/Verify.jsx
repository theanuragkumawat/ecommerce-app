import authService from '@/appwrite/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

function Verify() {
  const [isVerified, setIsVerified] = useState(false);
  const [message,setMessage] = useState('Verifying email...')
  const navigate = useNavigate()
  
  async function getVerify() {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');
    try {
      const data = await authService.updateVerification(userId, secret);
      if (data) {
        setIsVerified(true)
        navigate('/')
      }
    } catch (error) {
      setMessage('Verification failed')
      console.log(error.message);
    }
  }

  useEffect(() => {
    getVerify();
  },[])

  return (
 
      <div className='h-full text-center my-auto text-4xl text-gray-950 font-bold'>{message}</div>
   
  )
}

export default Verify