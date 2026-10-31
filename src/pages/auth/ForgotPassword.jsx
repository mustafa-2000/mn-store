import { useState } from "react";

function ForgotPassword({
  onBack,
  onShowLogin,
  onShowResetPassword,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setMessage(
      "Your email has been accepted for this demo. Password recovery will be enabled when the backend is connected.",
    );
  }

  return (
    <section className="mn-auth-page">
      <div className="mn-auth-card">
        <button type="button" className="mn-auth-back" onClick={onBack}>
          ← Back to store
        </button>

        <div className="mn-auth-brand">
          MN<span>STORE.</span>
        </div>

        <span className="mn-auth-eyebrow">ACCOUNT RECOVERY</span>

        <h1>Forgot your password?</h1>

        <p className="mn-auth-description">
          Enter the email address associated with your account. We'll help you
          get back into your account.
        </p>

        <form className="mn-auth-form" onSubmit={handleSubmit}>
          <label htmlFor="mn-forgot-email">Email address</label>

          <input
            id="mn-forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          {error && (
            <p className="mn-auth-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="mn-auth-success" role="status">
              {message}
            </p>
          )}

          {message && (
            <button
              type="button"
              className="mn-auth-submit"
              onClick={onShowResetPassword}
            >
              Continue to reset password <span>↗</span>
            </button>
          )}

          <button type="submit" className="mn-auth-submit">
            Continue <span>↗</span>
          </button>
        </form>

        <p className="mn-auth-switch">
          Remember your password?{" "}
          <button type="button" onClick={onShowLogin}>
            Sign in
          </button>
        </p>
      </div>
    </section>
  );
}

export default ForgotPassword;
