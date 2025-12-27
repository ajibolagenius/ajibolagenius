import React from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Works from '../components/Works'
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
                <Works />
                <Footer />
            </div>
        </>
    )
}

export default Portfolio
