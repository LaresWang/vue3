import { ElMessage, type Message, type messageType } from "element-plus";

export default (msg:string, msgType:messageType="success", duration:number=3000)=>{
  ElMessage({
    message: msg,
    type: msgType,
    duration
  })
}
export const oriMessage: Message = ElMessage