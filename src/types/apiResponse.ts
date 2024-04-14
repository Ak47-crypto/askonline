import {Message} from '@/model/user'

export interface apiResponse {
    success:boolean,
    message:string,
    isAccesptingMessages?:boolean
    messages?:Array<Message>
}