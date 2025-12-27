import React from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useColorChanger } from '../hooks/useColorChanger'
import { useAnimations } from '../hooks/useAnimations'

function Courses() {
    useColorChanger()
    useAnimations()

    return (
        <>
            <Loader />
            <div id="main" data-bgcolor="#e9e9e9" data-textcolor="#181818">
                <Nav />

                <header className="pt-[20vh] px-[5vw] pb-[10vh]">
                    <h1 className="text-[8vw] leading-[0.9] font-[TTHovesDemiBold] reveal">
                        Learning Log
                    </h1>
                </header>

                <section className="px-[5vw] pb-[20vh]">
                    <div className="space-y-8">
                        <div className="p-6 border border-gray-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300">
                            <h2 className="text-2xl font-bold">Three.js Journey</h2>
                            <p className="opacity-70">Bruno Simon</p>
                            <p className="mt-4">Mastering 3D on the web using WebGL and Three.js.</p>
                        </div>
                        {/* Add more courses here */}
                    </div>
                </section>

                <Footer />
            </div>
        </>
    )
}

export default Courses
