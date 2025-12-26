import { Link } from 'react-router-dom'
import { useClock } from '../hooks/useClock'

function Nav() {
    const time = useClock()

    return (
        <nav>
            <div className="wrapper">
                <h1>Ajibola Akelebe</h1>
                <div className="links">
                    <Link to="/" className="underLineLink">
                        Index
                    </Link>
                    <Link to="/approach" className="underLineLink">
                        Approach
                    </Link>
                </div>
            </div>

            <div id="MyClockDisplay" className="clock">
                {time}
            </div>
            <h3 className="font16">
                Based in <br /> Nigeria <br /> 🇳🇬
            </h3>
        </nav>
    )
}

export default Nav
