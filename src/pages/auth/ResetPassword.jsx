import { useState } from "react";

function ResetPassword({ onBack, onShowLogin }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setSuccess(true);
  }

  return (
    <section className="mn-auth-page">
      <div className="mn-auth-card">
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

        <span className="mn-auth-eyebrow">ACCOUNT SECURITY</span>

        <h1>Reset your password.</h1>

        <p className="mn-auth-description">
          Choose a new password with at least 8 characters.
        </p>

        {success ? (
          <>
            <p className="mn-auth-success" role="status">
              Your new password passed the demo checks. Actual password
              resetting will be enabled when the backend is connected.
            </p>

            <button
              type="button"
              className="mn-auth-submit"
              onClick={onShowLogin}
            >
              Return to sign in <span>↗</span>
            </button>
          </>
        ) : (
          <form className="mn-auth-form" onSubmit={handleSubmit}>
            <label htmlFor="mn-reset-password">New password</label>

            <div className="mn-auth-password-field">
              <input
                id="mn-reset-password"
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

            <label htmlFor="mn-reset-confirm">Confirm new password</label>

            <input
              id="mn-reset-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your new password again"
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
              Reset password <span>↗</span>
            </button>
          </form>
        )}

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

export default ResetPassword;