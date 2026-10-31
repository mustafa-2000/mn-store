
import Hero from "../../components/layout/Hero";
import CategoryShowcase from "../../components/layout/CategoryShowcase";

function Home({ setActiveFilter }) {
  return (
    <>
      <Hero />

      <section className="benefits" aria-label="Shopping benefits">
        <div>
          <span>✳</span>
          <p>
            <strong>Curated quality</strong>
            <small>Products worth keeping</small>
          </p>
        </div>

        <div>
          <span>↗</span>
          <p>
            <strong>Easy shopping</strong>
            <small>Simple from start to finish</small>
          </p>
        </div>

        <div>
          <span>◇</span>
          <p>
            <strong>Secure checkout</strong>
            <small>Shop with confidence</small>
          </p>
        </div>

        <div>
          <span>♡</span>
          <p>
            <strong>Here to help</strong>
            <small>Support when you need it</small>
          </p>
        </div>
      </section>

      <CategoryShowcase setActiveFilter={setActiveFilter} />
    </>
  );
}

export default Home;
