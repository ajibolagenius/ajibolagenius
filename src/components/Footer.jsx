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
                        <b>Currently availbale <br />for freelance projects.</b>
                    </p>
                    <div className="footer_col">
                        <p className="font16">
                            Based in <br /> Nigeria 🇳🇬
                        </p>
                        <h3 className="fontSmall">
                            For any collaborative ventures or enquiries, I warmly invite you to get in touch with me!
                            <a href="mailto:ajiboladolapogenius@gmail.com" className="underLineLink">
                                ajiboladolapogenius@gmail.com
                            </a>
                        </h3>
                    </div>
                    <div className="footer_col2">
                        <p className="font16">© {new Date().getFullYear()} All rights reserved.</p>
                        {/* Social links */}
                    </div>
                </div>
            </div>

            {/* EyeBall Social container */}
            <div className="Footer_Social" data-textcolor="#e9e9e9" data-bgcolor="#181818">
                <div className="footer_wrapper">
                    {/* eye */}
                    {/* <svg id="svg" ref={svgRef} viewBox="0 0 1000 1000">
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
                    </svg> */}
                    {/* Links */}
                    <div className="footer_container">
                        <div>
                            <a href="https://www.github.com/ajibolagenius" className="footer_text" target="_blank" rel="noopener noreferrer">
                                Github
                            </a>
                        </div>
                        <div>
                            <a href="https://www.instagram.com/ajibolagenius" className="footer_text" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                        </div>
                        <div>
                            <a href="https://twitter.com/ajibolagenius" className="footer_text" target="_blank" rel="noopener noreferrer">
                                Twitter
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
