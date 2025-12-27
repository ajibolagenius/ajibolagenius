import React from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useColorChanger } from '../hooks/useColorChanger'
import { useAnimations } from '../hooks/useAnimations'

function Contact() {
    useColorChanger()
    useAnimations()

    return (
        <>
            <Loader />
            <div id="main" data-bgcolor="#e9e9e9" data-textcolor="#181818">
                <Nav />

                <header className="pt-[20vh] px-[5vw] pb-[5vh]">
                    <h1 className="text-[8vw] leading-[0.9] font-[TTHovesDemiBold] reveal">
                        Let's Talk
                    </h1>
                </header>

                <section className="px-[5vw] pb-[20vh] max-w-2xl">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm uppercase tracking-wider opacity-50 mb-2">Name</label>
                            <input type="text" className="w-full bg-transparent border-b border-black py-4 focus:outline-none" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm uppercase tracking-wider opacity-50 mb-2">Email</label>
                            <input type="email" className="w-full bg-transparent border-b border-black py-4 focus:outline-none" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm uppercase tracking-wider opacity-50 mb-2">Message</label>
                            <textarea className="w-full bg-transparent border-b border-black py-4 focus:outline-none h-32 resize-none" placeholder="Tell me about your project..."></textarea>
                        </div>
                        <button className="px-8 py-4 bg-black text-white rounded-full mt-4 hover:scale-105 transition-transform">
                            Send Message
                        </button>
                    </form>
                </section>

                <Footer />
            </div>
        </>
    )
}

export default Contact
