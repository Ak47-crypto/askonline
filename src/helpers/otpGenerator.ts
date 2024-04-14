export function generateOTP(length:number) {
    const chars = '0123456789';
    let OTP = '';
  
    for (let i = 0; i < length; i++) {
      OTP += chars[Math.floor(Math.random() * chars.length)];
    }
  
    return OTP;
  }
  

  