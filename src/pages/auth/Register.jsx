import { useState } from "react";

function Register({ onRegister, onShowLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    onRegister({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  }

  return (
    <section className="mn-auth-page">
      <div className="mn-auth-card mn-register-card">
        <button
          type="button"
          className="mn-auth-back"
          onClick={onBack}
        >
          ← Back to store
        </button>

        <div className="mn-auth-brand">
          MN<span>STORE.</span>
        </div>

        <span className="mn-auth-eyebrow">JOIN MN STORE</span>
        <h1>Create your account.</h1>
        <p className="mn-auth-description">
          Create an account to manage your orders and wishlist.
        </p>

        <form className="mn-auth-form" onSubmit={handleSubmit}>
          <label htmlFor="mn-register-name">Full name</label>
          <input
            id="mn-register-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="mn-register-email">Email address</label>
          <input
            id="mn-register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="mn-register-password">Password</label>
          <div className="mn-auth-password-field">
            <input
              id="mn-register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="mn-register-confirm">Confirm password</label>
          <input
            id="mn-register-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your password again"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          {error && (
            <p className="mn-auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="mn-auth-submit">
            Create account <span>↗</span>
          </button>
        </form>

        <p className="mn-auth-switch">
          Already have an account?{" "}
          <button type="button" onClick={onShowLogin}>
            Sign in
          </button>
        </p>

        <p className="mn-auth-demo-note">
          Account creation will be connected to the secure backend in a later step.
        </p>
      </div>
    </section>
  );
}

export default Register;