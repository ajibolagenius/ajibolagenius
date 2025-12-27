import { useProjectHover } from '../hooks/useProjectHover'
import { ArrowRight } from '@phosphor-icons/react'

const projects = [
    {
        id: 1,
        name: 'Banking',
        url: 'https://dribbble.com/shots/20032111-Banking-Landing-Page',
        image: 'src/assets/work1.jpg',
    },
    {
        id: 2,
        name: 'Financilux',
        url: 'https://dribbble.com/shots/20003928-Financilux-Web-Site-Design-Landing-Page-Home-Page-UI',
        image: 'src/assets/work2.png',
    },
    {
        id: 3,
        name: 'Stride',
        url: 'https://dribbble.com/shots/23563739-Staking-Landing-Page',
        image: 'src/assets/work3.jpg',
    },
    {
        id: 4,
        name: 'Wine & Donuts',
        url: 'https://dribbble.com/shots/23611929-Wine-Donuts',
        image: 'src/assets/work4.png',
    },
]

function Works() {
    const { workRef, overlayRef } = useProjectHover()

    return (
        <div className="works" data-textcolor="#181818" data-bgcolor="#e9e9e9">
            {/* Heading */}
            <div className="work_heading">
                <div className="reveal">
                    <h1 className="fontLarge">Selected</h1>
                </div>
                <div className="reveal">
                    <h1 className="fontLarge">Works</h1>
                </div>

                {/* paragraph */}
                <div className="txt">
                    <p className="font16">
                        Explore a collection of impactful projects where my UI/UX design and front-end development skills come together to enhance user experiences. These projects showcase my progression from initial concepts to polished implementation, reflecting a dedication to developing engaging, efficient, and visually appealing digital solutions that connect with users and solve genuine problems.
                    </p>
                </div>
            </div>
            {/* Project list */}
            <div className="work_container">
                <div className="work" ref={workRef}>
                    {/* Imgs overlays */}
                    <div className="overlay" ref={overlayRef}>
                        {projects.map((project) => (
                            <div key={project.id} className="prev" id={`prev-${project.id}`}>
                                <img
                                    src={project.image}
                                    alt="work"
                                    width="auto"
                                    height="auto"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Projects */}
                    {projects.map((project, index) => (
                        <a
                            key={project.id}
                            className="work-item"
                            id={`w-${project.id}`}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="work-item-name">
                                <span>({String(index + 1).padStart(2, '0')})</span>
                                <h2 className="fontMedium">{project.name}</h2>
                            </div>
                            <div className="work-item-icon">
                                <div className="icon-holder i-1">
                                    <ArrowRight size={20} weight="duotone" />
                                </div>
                                <div className="icon-holder i-2">
                                    <ArrowRight size={20} weight="duotone" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Works
