import React from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useColorChanger } from '../hooks/useColorChanger'
import { useAnimations } from '../hooks/useAnimations'

function Portfolio() {
    useColorChanger()
    useAnimations()

    return (
        <>
            <Loader />
            <div id="main" data-bgcolor="#e9e9e9" data-textcolor="#181818">
                <Nav />

                <header className="pt-[20vh] px-[5vw] pb-[10vh]">
                    <h1 className="text-[8vw] leading-[0.9] font-[TTHovesDemiBold] reveal">
                        All Projects
                    </h1>
                </header>

                <section className="px-[5vw] pb-[20vh] grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* You can map through a projects array here */}
                    <div className="w-full aspect-video bg-gray-300 rounded-lg"></div>
                    <div className="w-full aspect-video bg-gray-300 rounded-lg"></div>
                    <div className="w-full aspect-video bg-gray-300 rounded-lg"></div>
                    <div className="w-full aspect-video bg-gray-300 rounded-lg"></div>
                </section>

                <Footer />
            </div>
        </>
    )
}

export default Portfolio
