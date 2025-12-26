function About() {
  return (
    <section className="about">
      {/* About */}
      <div className="reveal">
        <h1 className="fontLarge">About</h1>
      </div>

      <div className="about_text">
        <p className="font16">
          Beginning my journey as a graphic designer and evolving into a creative developer has endowed me
          with a distinctive insight, allowing me to seamlessly blend the realms of visual artistry and
          cutting-edge technology. This unique convergence of skills empowers me to create harmonious
          digital experiences that are both visually stunning and technologically advanced.
        </p>
        <h2 className="fontMedium">
          As a visionary developer with a flair for design, I immersive digital landscapes that marry
          innovation with crafting experiences.
        </h2>
      </div>
      {/* Tools */}
      <div className="tools" data-textcolor="#e9e9e9" data-bgcolor="#181818">
        <div className="tools_heading">
          <p className="font16">Core Tools</p>
        </div>
        <div className="tools_wrapper">
          <div>
            <h2 className="fontMedium">Javascript</h2>
            <p className="font16">
              Delving deep into the dynamic world of web development, my portfolio showcases a mastery of
              JavaScript - the heartbeat of modern websites. From interactive UIs to seamless user
              experiences, each project is a testament to the power and versatility of JavaScript in
              bringing creative visions to life.
            </p>
          </div>
          <div>
            <h2 className="fontMedium">WebGL</h2>
            <p className="font16">
              Explore the frontier of 3D web experiences through my portfolio, where WebGL's potent
              capabilities transform ideas into immersive realities. Each piece is a journey into
              high-performance graphics, showcasing how WebGL brings depth, motion, and interactivity to
              the canvas of the modern web.
            </p>
          </div>
          <div>
            <h2 className="fontMedium">NodeJs</h2>
            <p className="font16">
              Dive into the server-side of innovation with my portfolio, highlighting Node.js as the
              backbone of scalable and efficient web applications. Through projects that blend speed with
              functionality, I demonstrate how Node.js empowers developers to build robust back-ends,
              APIs, and real-time applications that stand at the forefront of modern web development.
            </p>
          </div>
          <div>
            <h2 className="fontMedium">Framer</h2>
            <p className="font16">
              Venture into the realm of intuitive design and seamless prototyping with my portfolio, where
              Framer's no-code platform breathes life into interactive web experiences. Each project
              exemplifies the art of visual storytelling, showcasing Framer's ability to transform ideas
              into dynamic, user-centric designs without a single line of code.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
