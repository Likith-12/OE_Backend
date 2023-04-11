import axios from 'axios'

import { signIn, signOut, useSession } from 'next-auth/react'
import Router from 'next/router'

export const handleSignout = async () => {
    // const router = useRouter()
    const result = await signOut({
        callbackUrl: '/',
        redirect: false,
    })
    Router.push('/auth/signin')
    
}




export const validateUser = async (user,account) => {


    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/login?token=${account.access_token}`
    console.log(url)

    try {
      const res=await axios.get(url)

      //if status is 200 then return true else return false
  
      return Promise.resolve(res.status === 200)
      } catch (error) {
      return Promise.resolve(false)
      }


    
   



        


}


export const handleOAuthSignIn = (provider) => async () => {
  //if error alert error else push to home
  //try to sign in with provider and if error alert error
  try {
    await signIn(provider, {
      callbackUrl: "http://localhost:3000",
      redirect: false,
    });
    Router.push(asPath);
  } catch (error) {
    Router.push("/auth/signin");
  }
};