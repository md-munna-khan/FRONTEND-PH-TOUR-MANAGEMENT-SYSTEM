export interface ISendOtp{
  email:string
}

export interface ILogin{
    email:string,
    password:string
}
export interface IVerifyOtp{
    email:string,
   otp:string
}