import { useState } from "react"
import { VideoRoom } from "./videoroom"

export const Videocall = () => {
    const [joined, setJoined] = useState(false)
    return(
        <>
         <div class="flex flex-col justify-center items-center mt-10 ">
            <h1>Student live session</h1>
            {!joined && (
                <button class="bg-red-700 text-white w-fit h-fit p-1 rounded " onClick={() => setJoined(true)}>Join Room</button>
            )}
            
            {joined && (
                <div><VideoRoom /></div>  
            )}
         </div>
        </>
    )
}