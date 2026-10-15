import React, { useState } from "react";
import { Instagram } from "lucide-react";

export default function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (isSignup && (!name.trim() || !username.trim())) {
      setError("Please enter your name and username.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Demo only: no real authentication yet.
    onLogin(username.trim() || email.split("@")[0]);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <Instagram size={32} />
          <h1>Instagram</h1>
        </div>

        <h2>{isSignup ? "Create an account" : "Welcome back"}</h2>
        <p className="auth-subtitle">
          {isSignup
            ? "Sign up to see photos and connect with friends."
            : "Log in to see photos and connect with friends."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <>
              <input
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit">
            {isSignup ? "Sign up" : "Log in"}
          </button>
        </form>

        <div className="auth-switch">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </div>

        <p className="auth-disclaimer">
          Demo interface — accounts are not saved yet.
        </p>
      </section>
    </main>
  );
}
