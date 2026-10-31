import { useState } from "react";
import { loginUser } from "../../services/api";

function Login({ onLogin, onShowRegister, onShowForgotPassword, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

 async function handleSubmit(event) {
  event.preventDefault();
  setError("");

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    const data = await loginUser(email.trim(), password);
    onLogin(data);
  } catch (error) {
    setError(error.message || "Unable to sign in. Please try again.");
  }
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

        <span className="mn-auth-eyebrow">WELCOME BACK</span>
        <h1>Sign in to your account.</h1>
        <p className="mn-auth-description">
          Access your orders, wishlist, and account details.
        </p>

        <form className="mn-auth-form" onSubmit={handleSubmit}>
          <label htmlFor="mn-login-email">Email address</label>
          <input
            id="mn-login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="mn-auth-password-label">
            <label htmlFor="mn-login-password">Password</label>

            <button
              type="button"
              className="mn-auth-forgot-link"
              onClick={onShowForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <div className="mn-auth-password-field">
            <input
              id="mn-login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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

          {error && (
            <p className="mn-auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="mn-auth-submit">
            Sign in <span>↗</span>
          </button>
        </form>

        <p className="mn-auth-switch">
          Don't have an account?{" "}
          <button type="button" onClick={onShowRegister}>
            Create account
          </button>
        </p>

        <p className="mn-auth-demo-note">
          Sign-in will be connected to the secure backend in a later step.
        </p>
      </div>
    </section>
  );
}

export default Login;
