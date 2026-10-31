
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="eyebrow">
          <span className="eyebrow-line" />
          THE EVERYDAY EDIT
        </span>

        <h1>
          Find your
          <br />
          next <span>favorite.</span>
        </h1>

        <p>
          Thoughtfully selected essentials for your style,
          your space, and everything in between.
        </p>

        <a className="primary-button" href="#products">
          Explore the collection <span>↗</span>
        </a>

        <div className="hero-trust">
          <div className="avatar-stack">
            <span>M</span>
            <span>A</span>
            <span>S</span>
          </div>
          <div>
            <strong>Made for everyday life</strong>
            <small>Discover something you love.</small>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=90"
          alt="Modern retail store interior"
        />

        <div className="image-note">
          <span className="note-dot" />
          <div>
            <strong>Good things, thoughtfully chosen.</strong>
            <small>Welcome to MN Store</small>
          </div>
        </div>

        <span className="hero-number">01 / 04</span>
      </div>
    </section>
  );
}

export default Hero;
