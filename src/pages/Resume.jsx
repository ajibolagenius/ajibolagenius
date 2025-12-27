import React from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useColorChanger } from '../hooks/useColorChanger'
import { useAnimations } from '../hooks/useAnimations'

function Resume() {
    useColorChanger()
    useAnimations()

    return (
        <>
            <Loader />
            <div id="main" data-bgcolor="#181818" data-textcolor="#e9e9e9">
                <Nav />

                <header className="pt-[20vh] px-[5vw] pb-[10vh]">
                    <h1 className="text-[8vw] leading-[0.9] font-[TTHovesDemiBold] reveal text-[#e9e9e9]">
                        Resume
                    </h1>
                </header>

                <section className="px-[5vw] pb-[20vh] max-w-4xl text-[#e9e9e9]">
                    <div className="mb-12 border-b border-[#333] pb-8">
                        <h2 className="text-2xl mb-4 opacity-50">Experience</h2>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Freelance Developer</h3>
                            <p className="opacity-70">2023 - Present</p>
                            <p className="mt-2">Building interactive web experiences for agencies and startups.</p>
                        </div>
                    </div>

                    <div className="mb-12 border-b border-[#333] pb-8">
                        <h2 className="text-2xl mb-4 opacity-50">Skills</h2>
                        <div className="flex flex-wrap gap-4">
                            {['JavaScript', 'React', 'GSAP', 'Three.js', 'Node.js'].map(skill => (
                                <span key={skill} className="px-4 py-2 border border-[#333] rounded-full">{skill}</span>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    )
}

export default Resume
