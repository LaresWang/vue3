import useOperate from "@/hooks/human/operate"
import { genUUID } from "./tools"
import { EKeyboardType } from "@/types/player.d"

const operate = useOperate()

const switchToFaceCamera = () => {
  operate.sendCmd({
    type: EKeyboardType.Keydown,
    event: {
      key: "1",
      keyCode: 49,
      code: "Digit1",
      repeat: false
    },
    taskId: genUUID()
  })
  setTimeout(() => {
    operate.sendCmd({
      type: EKeyboardType.Keyup,
      event: {
        key: "1",
        keyCode: 49,
        code: "Digit1",
        repeat: false
      },
      taskId: genUUID()
    })
  }, 300)
}

const switchToBodyCamera = () => {
  operate.sendCmd({
    type: EKeyboardType.Keydown,
    event: {
      key: "2",
      keyCode: 50,
      code: "Digit2",
      repeat: false
    },
    taskId: genUUID()
  })
  setTimeout(() => {
    operate.sendCmd({
      type: EKeyboardType.Keyup,
      event: {
        key: "2",
        keyCode: 50,
        code: "Digit2",
        repeat: false
      },
      taskId: genUUID()
    })
  }, 300)
}

export { switchToFaceCamera, switchToBodyCamera }
