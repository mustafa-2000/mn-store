
function Footer() {
  return (
    <footer className="footer" id="footer">
      <a className="logo footer-logo" href="#home">
        MN<span>STORE.</span>
      </a>

      <p>Everyday essentials. Thoughtfully chosen.</p>

      <div className="footer-links">
        <a href="#products">Shop</a>
        <a href="#categories">Categories</a>
        <a href="#home">Back to top ↑</a>
      </div>

      <small>
        © {new Date().getFullYear()} MN Store. Portfolio project.
      </small>
    </footer>
  );
}

export default Footer;
