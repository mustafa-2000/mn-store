
function CategoryShowcase({ setActiveFilter }) {
  return (
    <section className="mn-categories" id="categories">
      <div className="mn-categories-header">
        <div>
          <span className="mn-eyebrow">CURATED FOR YOUR LIFESTYLE</span>
          <h2>
            Find your
            <br />
            <span>next favorite.</span>
          </h2>
        </div>

        <div className="mn-categories-intro">
          <p>
            Discover thoughtfully selected products for your style,
            your space, and everything in between.
          </p>
          <a href="#products" className="mn-text-link">
            Explore all products <span>↗</span>
          </a>
        </div>
      </div>

      <div className="mn-category-grid">
        <a
          href="#products"
          className="mn-category-card mn-fashion"
          onClick={() => setActiveFilter("Fashion")}
        >
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
            alt="Fashion collection"
            loading="lazy"
          />
          <div className="mn-card-shade" />
          <span className="mn-card-number">01 / STYLE</span>
          <div className="mn-card-content">
            <span className="mn-card-tag">EXPRESS YOURSELF</span>
            <h3>Fashion</h3>
            <p>Find your everyday look.</p>
            <span className="mn-card-link">
              Discover collection <span>↗</span>
            </span>
          </div>
        </a>

        <a
          href="#products"
          className="mn-category-card mn-tech"
          onClick={() => setActiveFilter("Technology")}
        >
          <img
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=85"
            alt="Technology and electronics"
            loading="lazy"
          />
          <div className="mn-card-shade" />
          <span className="mn-card-number">02 / INNOVATION</span>
          <div className="mn-card-content">
            <span className="mn-card-tag">SMARTER EVERY DAY</span>
            <h3>Technology</h3>
            <p>Discover what’s next.</p>
            <span className="mn-card-link">
              Explore technology <span>↗</span>
            </span>
          </div>
        </a>

        <a
          href="#products"
          className="mn-category-card mn-accessories"
          onClick={() => setActiveFilter("Accessories")}
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
            alt="Accessories and personal style"
            loading="lazy"
          />
          <div className="mn-card-shade" />
          <span className="mn-card-number">03 / DETAILS</span>
          <div className="mn-card-content">
            <span className="mn-card-tag">THE FINISHING TOUCH</span>
            <h3>Accessories</h3>
            <p>Little things. Big impact.</p>
            <span className="mn-card-link">
              Find your favorites <span>↗</span>
            </span>
          </div>
        </a>

        <a
          href="#products"
          className="mn-category-card mn-lifestyle"
          onClick={() => setActiveFilter("Lifestyle")}
        >
          <img
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85"
            alt="Lifestyle and home essentials"
            loading="lazy"
          />
          <div className="mn-card-shade" />
          <span className="mn-card-number">04 / EVERYDAY</span>
          <div className="mn-card-content">
            <span className="mn-card-tag">LIVE BEAUTIFULLY</span>
            <h3>Lifestyle</h3>
            <p>Make room for better living.</p>
            <span className="mn-card-link">
              Explore essentials <span>↗</span>
            </span>
          </div>
        </a>
      </div>

      <div className="mn-categories-footer">
        <span>MN STORE — YOUR WORLD, YOUR WAY</span>
        <a href="#products">
          SHOP THE COLLECTION <span>↗</span>
        </a>
      </div>
    </section>
  );
}

export default CategoryShowcase;
