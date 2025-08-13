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