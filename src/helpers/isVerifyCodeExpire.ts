export function isVerifyCodeExpire(
    verifyCodeExpiry:any
):boolean{
    if(verifyCodeExpiry>Date.now())
        return true
    return false
}