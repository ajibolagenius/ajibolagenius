import { Link } from 'react-router-dom'
import { useClock } from '../hooks/useClock'

function Nav() {
  const time = useClock()

  return (
    <nav>
      <div className="wrapper">
        <h1>Will Jacks</h1>
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
        Based in <br /> London, UK
      </h3>
    </nav>
  )
}

export default Nav
