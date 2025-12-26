function Header() {
  return (
    <section className="header">
      <div className="wrapper">
        <video
          autoPlay
          muted
          loop
          src="/assets/header_img_animation.mp4"
          className="headerImg"
          width="auto"
          height="auto"
          preload="none"
          data-scroll
          data-scroll-speed="1"
        ></video>
        <div className="text">
          <p className="font16">Currently availbale for freelance projects</p>
          <p className="font16">
            Developer and designer fueled by the rich cultural tapestry of Queens, operating as a solo
            innovator to create unforgettable experiences.
          </p>
        </div>
      </div>

      {/* marquee */}
      <div className="marquee">
        <div className="track">
          <h1 className="content fontLarge">
            &nbsp; UIUX Designer — Frontend Developer — UIUX Designer — Frontend Developer — UIUX Designer —
            Frontend Developer — UIUX Designer — Frontend Developer — UIUX Designer — Frontend Developer —
            UIUX Designer — Frontend Developer — UIUX Designer — Frontend Developer — UIUX Designer —
            Frontend Developer —
          </h1>
        </div>
      </div>
    </section>
  )
}

export default Header
