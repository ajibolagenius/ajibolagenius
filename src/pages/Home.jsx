import { useEffect } from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Header from '../components/Header'
import About from '../components/About'
import Works from '../components/Works'
import Footer from '../components/Footer'
import { useColorChanger } from '../hooks/useColorChanger'
import { useAnimations } from '../hooks/useAnimations'

function Home() {

    return (
        <>
            <Loader />
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
