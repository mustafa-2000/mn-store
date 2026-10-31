
function NewsletterSection() {
  const handleSubmit = (event) => {
    event.preventDefault();

    window.alert(
      "Thanks for your interest! Newsletter signup will be connected to the backend later."
    );

    event.currentTarget.reset();
  };

  return (
    <section className="newsletter">
      <div>
        <span className="eyebrow">A LITTLE SOMETHING EXTRA</span>

        <h2>Good finds, straight to your inbox.</h2>

        <p>
          Be the first to hear about new arrivals and special offers.
        </p>
      </div>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="newsletter-email">
          Email address
        </label>

        <input
          id="newsletter-email"
          type="email"
          placeholder="Your email address"
          required
        />

        <button type="submit">Join us ↗</button>
      </form>
    </section>
  );
}

export default NewsletterSection;
