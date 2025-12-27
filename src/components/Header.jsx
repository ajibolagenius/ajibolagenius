function Header() {
    return (
        <section className="header">
            <div className="wrapper">
                <img
                    src="src/assets/ajibolagenius_avatar.png"
                    alt="Ajibola Akelebe"
                    className="headerImg"
                    width="auto"
                    height="auto"
                    loading="eager"
                />
                <div className="text">
                    <p className="fontSmall">
                        <b>Currently available for freelance projects.</b>
                    </p>
                    <p className="font16">
                        An independent developer and designer inspired by the diverse cultural heritage of Atra and Terra, dedicated to crafting memorable experiences.
                    </p>
                </div>
            </div>

            <div className="marquee">
                <div className="track">
                    <h1 className="content fontLarge">
                        Design ⚬ Engineering — Design ⚬ Engineering — Design ⚬ Engineering — Design ⚬ Engineering — Design ⚬ Engineering — Design ⚬ Engineering — Design ⚬ Engineering — Design ⚬
                        Engineering —
                    </h1>
                </div>
            </div>
        </section>
    )
}

export default Header
