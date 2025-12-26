import { useEffect } from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Header from '../components/Header'
import About from '../components/About'
import Works from '../components/Works'
import Footer from '../components/Footer'
import { useLenis } from '../hooks/useLenis'
import { useColorChanger } from '../hooks/useColorChanger'
import { useAnimations } from '../hooks/useAnimations'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

function Home() {

    return (
        <>
            <Loader />
            {/* Remove ref={scrollRef} */}
            <div id="main" data-textcolor="#181818" data-bgcolor="#e9e9e9">
                <Nav />
                <Header />
                <About />
                <Works />
                <Footer />
            </div>
        </>
    )
}
export default Home
