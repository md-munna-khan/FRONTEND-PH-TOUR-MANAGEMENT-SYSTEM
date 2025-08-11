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