// import { Link } from 'react-router-dom'
// import { useClock } from '../hooks/useClock'

// function Nav() {
//     const time = useClock()

//     return (
//         <nav>
//             <div className="wrapper">
//                 <h1>Ajibola Akelebe</h1>
//                 <div className="links">
//                     <Link to="/" className="underLineLink">
//                         Index
//                     </Link>
//                     <Link to="/approach" className="underLineLink">
//                         Approach
//                     </Link>
//                 </div>
//             </div>

//             <div id="MyClockDisplay" className="clock">
//                 {time}
//             </div>
//             <h3 className="font16">
//                 Based in <br /> Nigeria <br /> 🇳🇬
//             </h3>
//         </nav>
//     )
// }

// export default Nav

import React from 'react'
import { Link } from 'react-router-dom'
import { useClock } from '../hooks/useClock'

function Nav() {
    // Use your existing hook to get the time
    const { time } = useClock()

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-start px-5 py-6 md:px-10 text-[#e9e9e9] mix-blend-difference font-[TTHovesRegular]">

            {/* Left: Logo */}
            <div className="logo font-[TTHovesDemiBold] text-xl leading-none">
                <Link to="/">AJIBOLA.</Link>
            </div>

            {/* Center: Navigation Links (Hidden on Mobile) */}
            <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
                <Link to="/approach" className="hover:opacity-50 transition-opacity">Approach</Link>
                <Link to="/portfolio" className="hover:opacity-50 transition-opacity">Work</Link>
                <Link to="/resume" className="hover:opacity-50 transition-opacity">Resume</Link>
                <Link to="/courses" className="hover:opacity-50 transition-opacity">Courses</Link>
                <Link to="/contact" className="hover:opacity-50 transition-opacity">Contact</Link>
            </div>

            {/* Right: Location & Clock */}
            <div className="flex flex-col items-end text-right text-xs uppercase tracking-widest leading-relaxed">
                <div className="flex gap-2">
                    <span className="opacity-50">🇳🇬 </span>
                    <span>Nigeria</span>
                </div>
                <div className="flex gap-2">
                    <span className="opacity-50">GMT</span>
                    <span>+1</span>
                </div>
                <div className="mt-1 font-mono">
                    {time}
                </div>
            </div>

            {/* Mobile Menu Trigger (Visible only on mobile) */}
            <div className="md:hidden absolute top-6 right-5 cursor-pointer">
                Menu
            </div>

        </nav>
    )
}

export default Nav
