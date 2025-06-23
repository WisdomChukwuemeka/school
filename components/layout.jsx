import { useState } from "react"
import "bootstrap-icons/font/bootstrap-icons.css"
import {motion, AnimatePresence} from 'framer-motion'
import { Link, Outlet } from "react-router-dom"
import axios from "axios"
export const Layout = () => {
    const [menu, setMenu] = useState(true)
    const Menubar = () => {
        setMenu(!menu)
    }



    return(
        <>
            <div class='relative'>
                <header class=' bg-gradient-to-r from-red-900 via-purple-950 to-black w-full h-fit p-4 text-white lg:text-3xl shadow-md shadow-gray-500' >
                    <nav class='flex items-center justify-between'>
                        <h2 class="italic text-white">CELIA'S ACADEMY</h2>
                        <ul class='md:flex  gap-10 hidden'>
                            <li><Link to="/">Home</Link></li>
                            <li>About</li>
                            <li>Metro</li>
                            <li>contact</li>
                        </ul>
                        
                        <div class='flex gap-4 items-center'>
                            <div class='md:hidden' onClick={Menubar}>
                                {menu ? <i class="bi bi-list"></i> : <i class="bi bi-x-lg"></i> }
                            </div>
                            <div class='hidden md:flex bg-blue-300 text-white p-1.5 rounded h-fit w-fit hover:bg-white duration-500 hover:text-black'><Link to="/login">Login</Link></div>
                            <div class='hidden md:flex bg-blue-300 text-white p-1.5 rounded h-fit w-fit hover:bg-white duration-500 hover:text-black'>Logout</div>
                        </div>
                    </nav>
                </header>
                <div>
                    <AnimatePresence>
                    {!menu ? (
                        <motion.div
                        initial={{
                            x: 0
                        }}
                        animate={{
                            x: [400, 0]
                        }}
                        exit={{
                            x: [0, 400]
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                        class="absolute right-0 bg-red-900 text-white h-fit w-[50%] rounded-bl-4xl">
                            <ul class='flex gap-7 flex-col p-4 items-center '>
                                <div class='hover:bg-white w-full hover:text-black text-center duration-1000' ><Link to="/">Home</Link></div>
                                <div class='hover:bg-white w-full hover:text-black text-center duration-1000' ><li>About</li></div>
                                <div class='hover:bg-white w-full hover:text-black text-center duration-1000' ><li>Metro</li></div>
                                <div class='hover:bg-white w-full hover:text-black text-center duration-1000' ><li>contact</li></div> 
                                <div class='hover:bg-white w-full hover:text-black text-center duration-1000' ><Link to="/login">Login</Link></div>
                                <div class='hover:bg-white w-full hover:text-black text-center duration-1000' >Logout</div>    
                        </ul>
                        </motion.div>
                    ) : ("")}
                    </AnimatePresence>
                </div>

            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}