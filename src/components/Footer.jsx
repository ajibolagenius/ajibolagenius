import { useFooterEyes } from '../hooks/useFooterEyes'

function Footer() {
  const svgRef = useFooterEyes()

  return (
    <footer>
      {/* Footer Details */}
      <div id="footer_details" data-textcolor="#181818" data-bgcolor="#e9e9e9">
        {/* Heading */}
        <div className="footer_heading">
          <div className="reveal">
            <h1 className="fontLarge">Reach</h1>
          </div>
          <div className="reveal">
            <h1 className="fontLarge">Out</h1>
          </div>
        </div>
        {/* footer inner */}
        <div className="footer_inner">
          <p className="font16">
            Currently availbale <br /> for freelance projects
          </p>
          <div className="footer_col">
            <p className="font16">
              Based in <br /> London, UK
            </p>
            <h3 className="fontSmall">
              For any collaborative endeavors or inquiries, I warmly invite you to connect with me!
              <a href="mailto:hello@willjacks.com" className="underLineLink">
                hello@willjacks.com
              </a>
            </h3>
          </div>
          <div className="footer_col2">
            <p className="font16">© All rights reserved.</p>
            <div className="footer_inner_links">
              <a href="https://www.behance.net" className="underLineLink" target="_blank" rel="noopener noreferrer">
                Behance
              </a>
              <a href="https://dribbble.com" className="underLineLink" target="_blank" rel="noopener noreferrer">
                Dribble
              </a>
              <a href="https://contra.com" className="underLineLink" target="_blank" rel="noopener noreferrer">
                Contra
              </a>
              <a href="https://www.pinterest.com" className="underLineLink" target="_blank" rel="noopener noreferrer">
                Pinterest
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* EyeBall Social container */}
      <div className="Footer_Social" data-textcolor="#e9e9e9" data-bgcolor="#181818">
        <div className="footer_wrapper">
          {/* eye */}
          <svg id="svg" ref={svgRef} viewBox="0 0 1000 1000">
            <g id="left-eye">
              <circle
                className="eye-outer"
                cx="400"
                cy="500"
                r="100"
                stroke="#181818"
                strokeWidth="2"
                fill="#e9e9e9"
              />
              <circle className="eye-inner" cx="480" cy="500" r="20" fill="#181818" />
            </g>
            <g id="right-eye">
              <circle
                className="eye-outer"
                cx="600"
                cy="500"
                r="100"
                stroke="#181818"
                strokeWidth="2"
                fill="#e9e9e9"
              />
              <circle className="eye-inner" cx="680" cy="500" r="20" fill="#181818" />
            </g>
          </svg>
          {/* Links */}
          <div className="footer_container" data-scroll data-scroll-speed="-2">
            <div>
              <a href="https://www.instagram.com" className="footer_text" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
            <div>
              <a href="https://www.facebook.com" className="footer_text" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href="https://twitter.com" className="footer_text" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </div>
            <div>
              <a href="https://www.linkedin.com" className="footer_text" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
