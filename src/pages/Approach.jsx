import { useEffect } from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import DevMenu from '../components/DevMenu'
import { useColorChanger } from '../hooks/useColorChanger'
import { useAnimations } from '../hooks/useAnimations'

function Approach() {
    useColorChanger()
    useAnimations()

    return (
        <>
            <Loader />
            <DevMenu />
            <div id="main" data-textcolor="#181818" data-bgcolor="#e9e9e9">
                <Nav />

                {/* Header */}
                <section className="approachHeader">
                    <h2 className="fontMedium">
                        Maximizing client satisfaction hinges on mastering the art of seamless collaboration.
                    </h2>
                </section>

                {/* Details */}
                <section className="approachDetails">
                    <div className="col">
                        <div>
                            <p className="font16">Services</p>
                            <p className="font16">Web Design</p>
                            <p className="font16">Motion Design</p>
                            <p className="font16">Web Development</p>
                            <p className="font16">No Code Development</p>
                        </div>
                        <div>
                            <p className="font16">
                                To create a website that not only meets but also exceeds client expectations, I adopt a
                                detailed and careful approach that starts with thorough discussions with the client. This
                                initial step allows me to fully grasp their vision, objectives, and the audience they aim
                                to reach, setting a strong groundwork. Maintaining open and collaborative communication
                                with clients throughout this process is crucial, as it ensures the end result not only
                                fulfills their requirements but also exceeds them, resulting in a website that engages and
                                enchants their target audience.
                            </p>
                        </div>
                    </div>
                    <div className="col">
                        <div>
                            <p className="font16">Disciplines</p>
                            <p className="font16">Creative Developer</p>
                            <p className="font16">Modern Designer</p>
                        </div>
                        <div>
                            <p className="font16">
                                As a Creative Developer and Modern Designer, I fuse innovation with artistry to create
                                compelling digital experiences. My work transcends mere code and design; it's about crafting
                                interactive moments that inspire and engage. I blend aesthetics with functionality, ensuring
                                every element serves a purpose. Through this holistic approach, I push digital boundaries,
                                delivering forward-thinking solutions that redefine standards in the digital landscape.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Process */}
                <section className="about">
                    <div className="tools" data-textcolor="#e9e9e9" data-bgcolor="#181818">
                        <div className="tools_heading">
                            <p className="font16">Process</p>
                        </div>
                        <div className="tools_wrapper">
                            <div>
                                <h2 className="fontMedium">Art Direction</h2>
                                <p className="font16">
                                    In the initial stage of art direction, I craft the project's visual and narrative
                                    identity. By conducting thorough research, engaging in collaboration and consultation with
                                    clients, I capture the project's core, defining its atmosphere, emotional impact, and
                                    overall visual style. This phase lays the groundwork, creating a distinct vision that
                                    steers the following design endeavors.
                                </p>
                            </div>
                            <div>
                                <h2 className="fontMedium">Design</h2>
                                <p className="font16">
                                    In the early phase of the design process, I develop the project's aesthetic and conceptual
                                    foundation. Through in-depth research and active engagement with clients, I pinpoint the
                                    essence of the project, shaping its visual language, emotional resonance, and design
                                    principles. This step forms the cornerstone, crafting a unique direction that influences all
                                    subsequent design activities.
                                </p>
                            </div>
                            <div>
                                <h2 className="fontMedium">Development</h2>
                                <p className="font16">
                                    In the initial stage of development, I establish the project's functional and conceptual
                                    framework. By conducting thorough research, engaging in collaboration and consultation with
                                    clients, I pinpoint the project's fundamental requirements, defining its goals, user
                                    experience objectives, and technical specifications. This phase sets the foundation,
                                    building a clear strategy that guides the subsequent development process.
                                </p>
                            </div>
                            <div>
                                <h2 className="fontMedium">No - Code</h2>
                                <p className="font16">
                                    In the initial phase of no-code development, I define the project's functional blueprint
                                    and user interaction strategy. By undertaking comprehensive research, fostering
                                    collaboration, and consulting with clients, I distill the project's primary objectives,
                                    outlining its user journey, interface design, and interaction flow. This stage establishes
                                    a solid foundation, formulating a clear blueprint that directs the forthcoming no-code
                                    development activities.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    )
}

export default Approach
