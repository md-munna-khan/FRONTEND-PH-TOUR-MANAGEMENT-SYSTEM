# Ph Tour Management frontend Part-3
GitHub Link: https://github.com/Apollo-Level2-Web-Dev/ph-tour-management-system-frontend/tree/part-3

## 37-1 Creating the OTP Input Card Interface
- verify.tsx
```ts

import { Button } from '@/components/ui/button';
import { Card,  CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router'
import z from 'zod';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})
export default function Verify() {
  const location=useLocation()
  const navigate = useNavigate()
  const [email]=useState(location.state);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })
  const onSubmit=(data: z.infer<typeof FormSchema>)=>{
    console.log(data)
  }

  // useEffect(()=>{
  //   if(!email){
  //     navigate("/")
  //   }
  // },[email])
  // console.log(location)
  return (
    <div className='grid place-content-center h-screen'>
     <Card>
  <CardHeader>
    <CardTitle>Verify Your Email Address</CardTitle>
    <CardDescription>Please Enter the 6-digit code We sent To <br/> {email}
    </CardDescription>
  
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form 
      id="otp-form"
      onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    
      </form>
    </Form>
  </CardContent>
  <CardFooter className='flex justify-end '>
    <Button form="otp-form" type="submit">Submit</Button>
  </CardFooter>
</Card>
    </div>
  )
}

```
## 37-2 Sending OTP Code with Type-Safe RTK Query Mutation

- types => index.ts
- all types collect to type folder 
```ts
export type {ISendOtp,ILogin} from "./auth.type";

export interface IResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}
```
- auth.type.ts
```ts
export interface ISendOtp{
  email:string
}

export interface ILogin{
    email:string,
    password:string
}
```
- auth.api.ts
- first peramater IResponse generic second result
```ts
  sendOtp: builder.mutation<IResponse<null>,ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
```

- verify.ts
```ts

import { Button } from '@/components/ui/button';
import { Card,  CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useSendOtpMutation } from '@/redux/features/auth/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner';
import z from 'zod';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})
export default function Verify() {
  const location=useLocation()
  const navigate = useNavigate()
  const [email]=useState(location.state);
  const [sendOtp]= useSendOtpMutation()

const [confirmed,setConfirmed]=useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })
const handleConfirm =async () =>{
  try {
   const res = await sendOtp({email:email}).unwrap()
   if(res.success){
    toast.success("OTP sent")
   }
    setConfirmed(true);

  } catch (error) {
    console.log(error)
  }

}

  const onSubmit=(data: z.infer<typeof FormSchema>)=>{
    console.log(data)
  }

  // useEffect(()=>{
  //   if(!email){
  //     navigate("/")
  //   }
  // },[email])
  // console.log(location)
  return (
    <div className='grid place-content-center h-screen'>
    {confirmed ?( <Card>
  <CardHeader>
    <CardTitle>Verify Your Email Address</CardTitle>
    <CardDescription>Please Enter the 6-digit code We sent To <br/> {email}
    </CardDescription>
  
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form 
      id="otp-form"
      onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
            
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    
      </form>
    </Form>
  </CardContent>
  <CardFooter className='flex justify-end '>
    <Button form="otp-form" type="submit">Submit</Button>
  </CardFooter>
     </Card>):(  <Card>
  <CardHeader>
    <CardTitle>Verify Your Email Address</CardTitle>
    <CardDescription>We Will send you an OTP at  <br/> {email}
    </CardDescription>
  
  </CardHeader>
 
  <CardFooter className='flex justify-end '>
    <Button onClick={handleConfirm} className="w-[300px]">Confirm</Button>
  </CardFooter>
     </Card>)}

     
    </div>
  )
}

```

## 37-3 Verifying OTP and Handling User Login

- types => index.ts
- all types collect to type folder 
```ts
export type {ISendOtp,ILogin, IVerifyOtp} from "./auth.type";
```
- auth.type.ts
```ts
export interface IVerifyOtp{
    email:string,
   otp:string
}
```
- auth.api.ts
- first peramater IResponse generic second result
```ts
  verifyOtp: builder.mutation<IResponse<null>,IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
```

- verify.ts
```ts

import { Button } from '@/components/ui/button';
import { Card,  CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useSendOtpMutation, useVerifyOtpMutation } from '@/redux/features/auth/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner';
import z from 'zod';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})
export default function Verify() {
  const location=useLocation()
  const navigate = useNavigate()
  const [email]=useState(location.state);
  const [sendOtp]= useSendOtpMutation();
  const[verifyOtp]=useVerifyOtpMutation()

const [confirmed,setConfirmed]=useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })
const handleConfirm =async () =>{
  const toastId = toast.loading("Sending OTP")
  try {
   const res = await sendOtp({email:email}).unwrap()
   if(res.success){
    toast.success("OTP sent",{id:toastId})
    setConfirmed(true);
   }
  } catch (error) {
    console.log(error)
  }

}

const onSubmit=async (data: z.infer<typeof FormSchema>)=>{
  const toastId = toast.loading("Verifying OTP")
const userInfo = {
  email,
  otp:data.pin
}
try {
   const res = await verifyOtp(userInfo).unwrap()
   if(res.success){
    toast.success("OTP Verified",{id:toastId})
    setConfirmed(true);
   }
} catch (error) {
  console.log(error)
}
  }

  // useEffect(()=>{
  //   if(!email){
  //     navigate("/")
  //   }
  // },[email])
  // console.log(location)
  return (
    <div className='grid place-content-center h-screen'>
    {confirmed ?( <Card>
  <CardHeader>
    <CardTitle>Verify Your Email Address</CardTitle>
    <CardDescription>Please Enter the 6-digit code We sent To <br/> {email}
    </CardDescription>
  
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form 
      id="otp-form"
      onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
            
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    
      </form>
    </Form>
  </CardContent>
  <CardFooter className='flex justify-end '>
    <Button form="otp-form" type="submit">Submit</Button>
  </CardFooter>
     </Card>):(  <Card>
  <CardHeader>
    <CardTitle>Verify Your Email Address</CardTitle>
    <CardDescription>We Will send you an OTP at  <br/> {email}
    </CardDescription>
  
  </CardHeader>
 
  <CardFooter className='flex justify-end '>
    <Button onClick={handleConfirm} className="w-[300px]">Confirm</Button>
  </CardFooter>
     </Card>)}

     
    </div>
  )
}


```
## 37-4 Managing Status Codes and Fixing Credential Mismatch Issues
- when user password does not match and not verified we are temporary handle this but not perfect way it is
- loginForm.tsx
```ts
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";

import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const form = useForm();
  const [login] = useLoginMutation();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await login(data).unwrap();
      console.log(res);
    } catch (err) {
      console.error(err);

     
      if (err.data.message ==="Password Does Not Match") {
        toast.error("Invalid Credentials");
      }
      
       if (err.data.message === "User is Not Verified") {
        toast.error("Your account is not verified");
        navigate("/verify", { state: data.email });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
        >
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" replace className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </div>
  );
}
```
## 37-5 Handling useEffect Cleanup, Reset Button Functionality, and Overview of the cn Utility

- clsx
Purpose: Conditionally join multiple classes into a single string.

Problem it solves:
In React/JS, you often need to apply classes only if certain conditions are true.

Example:
import clsx from "clsx"
```ts
const Button = ({ primary, disabled }) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded",
        primary && "bg-blue-500 text-white",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      Click me
    </button>
  )
}
```
-  Tailwind Merge (tailwind-merge)
Purpose: Automatically resolve conflicts between Tailwind CSS classes.

Problem it solves:
In Tailwind, if you accidentally include two classes from the same group, you need to make sure only the correct one stays. tailwind-merge does that for you.

Example:
```ts
import { twMerge } from "tailwind-merge"

const Button = () => {
  return (
    <button
      className={twMerge("px-4 py-2 bg-red-500", "bg-blue-500")}
    >
      Click me
    </button>
  )
}
```


- Resent Otp handeling with timer 
```ts
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state);
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [confirmed, setConfirmed] = useState(false);

  const [timer, setTimer] = useState(10);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleSendOtp = async () => {
    
    const toastId = toast.loading("Sending OTP")
    try {
     const res = await sendOtp({email:email}).unwrap()
     if(res.success){
      toast.success("OTP sent",{id:toastId})
      setConfirmed(true);
       setTimer(10);
     }
    } catch (error) {
      console.log(error)
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const toastId = toast.loading("Verifying OTP");
    const userInfo = {
      email,
      otp: data.pin,
    };
    try {
      const res = await verifyOtp(userInfo).unwrap();
      if (res.success) {
        toast.success("OTP Verified", { id: toastId });
        setConfirmed(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(()=>{
  //   if(!email){
  //     navigate("/")
  //   }
  // },[email])
  // console.log(location)

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!email || !confirmed) {
        return;
      }
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      console.log("tick");
    }, 1000);
    return () => clearInterval(timerId);
  }, [confirmed, email]);
  return (
    <div className="grid place-content-center h-screen">
      {confirmed ? (
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Email Address</CardTitle>
            <CardDescription>
              Please Enter the 6-digit code We sent To <br /> {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="otp-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-6"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        <Button
                          onClick={handleSendOtp}
                          variant="link"
                          disabled={timer !== 0}
                          className={cn("p-0 m-0",{
                            "cursor-pointer": timer === 0,
                            "text-gray-500":timer !== 0
                          })}
                        >
                          Resent OTP:
                        </Button>{" "}
                        {timer}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end ">
            <Button form="otp-form" type="submit">
              Submit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Email Address</CardTitle>
            <CardDescription>
              We Will send you an OTP at <br /> {email}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-end ">
            <Button onClick={handleSendOtp} className="w-[300px]">
              Confirm
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
```
## 37-6 Exploring Token Management Strategies and Choosing the Right Approach
- token save 
- 1 local storage not save ❌
Problem:

Vulnerable to XSS attacks (any malicious JS on your site can read it).

Stays in browser storage indefinitely unless explicitly removed.

Attackers can steal it if they inject JS into your site.
```ts
localStorage.setItem("token", "your-jwt-token");
```

- 2 local storage not save ❌ because when page reload token removed
Difference from localStorage:

Data is removed automatically when the tab/window is closed.

Still vulnerable to XSS attacks because JavaScript can read it.

You said: “when page reload token removed” —
Actually, sessionStorage survives a reload but not a full tab close.
If your token disappears on reload, it might mean you're storing it in a React state instead of sessionStorage.
```ts
sessionStorage.setItem("token", "your-jwt-token");
```

- 3 token save in http only cookie ✅
Token is sent from server as a Set-Cookie header:

```bash
Set-Cookie: token=your-jwt-token; HttpOnly; Secure; SameSite=Strict
```
Browser stores it automatically.

You don’t manage it with localStorage or sessionStorage.

The cookie is sent automatically with every request to the server (based on domain).

Why it’s better:

HttpOnly → JavaScript cannot access it (prevents XSS theft).

Secure → Sent only over HTTPS.

SameSite → Reduces CSRF risk.

Drawback:

Slightly harder to manage with APIs like fetch (need credentials: "include").

## 37-7 Accessing Cookies on the Client Side
- update backend setCookie.ts
- secure true if not true cookie not save in browser
```ts
import { Response } from "express";

export interface AuthCookies {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthCookies) => {
  if (tokenInfo.accessToken) {
      res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite:"none"
    });
  }
  if (tokenInfo.refreshToken) {
      res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite:"none"
    });
  }
};

// before deploy
// import { Response } from "express";

// export interface AuthCookies {
//   accessToken?: string;
//   refreshToken?: string;
// }

// export const setAuthCookie = (res: Response, tokenInfo: AuthCookies) => {
//   if (tokenInfo.accessToken) {
//       res.cookie("accessToken", tokenInfo.accessToken, {
//       httpOnly: true,
//       sameSite:false
//     });
//   }
//   if (tokenInfo.refreshToken) {
//       res.cookie("refreshToken", tokenInfo.refreshToken, {
//       httpOnly: true,
 
//        sameSite:false
//     });
//   }
// };
```
- baseApi.ts
- if you not work axios update this as like
```ts
import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'

export const baseApi = createApi({
    reducerPath:"baseApi",
    // baseQuery:axiosBaseQuery(),
      baseQuery:fetchBaseQuery({
        baseUrl:config.baseUrl,
        credentials:"include"
    }),
    endpoints:() => ({})
})  
```
## 37-8 Implementing Google Login and Fixing Backend Authorization   
- axios.ts must be add withCredentials: true
```ts
import config from "@/config";
import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials:true
});


// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  },

);

// Add a response interceptor
axiosInstance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
```

- update backend checkAuth
```ts
const accessToken = req.headers.authorization ||✅ req.cookies.accessToken;
    if(!accessToken){
      throw new AppError(403,"No token Received");
      
    }
```
- loginForm.tsx
```ts
  <Button
        onClick={()=> window.open(`${config.baseUrl}/auth/google`)}
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
        >
          Login with Google
        </Button>
```

- axios.ts
```ts
export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
 withCredentials:true
});
```
- auth.api.ts
```ts
import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IVerifyOtp } from "@/types";




const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    sendOtp: builder.mutation<IResponse<null>,ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation<IResponse<null>,IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation,useSendOtpMutation,useVerifyOtpMutation,useUserInfoQuery,useLogoutMutation } = authApi;
```
- navbar.ts
```ts


import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ModeToggle } from "./ModeToggler"
import Logo from "@/assets/icons/Logo"
import { Link } from "react-router"
import { useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },

]

export default function Navbar() {
  const {data}=useUserInfoQuery(undefined)
 
  const [logout]=useLogoutMutation()
  const handleLogout =()=>{
    logout(undefined)
  }
 
  return (
    <header className="border-b ">
      <div className="container mx-auto px-4  flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5"
                        
                      >
                         <Link to={link.href}> {link.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                    asChild
                     className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      <Link to={link.href}> {link.label}</Link>
                     
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle/>
        {data?.data?.email && (
            <Button onClick={handleLogout} variant="outline"  className="text-sm">
            Logout
          </Button>
        )}
    {!data?.data?.email && (
        <Button asChild  className="text-sm">
        <Link to="/login">Login</Link>
      </Button>)}
       
        </div>
      </div>
    </header>
  )
}

```