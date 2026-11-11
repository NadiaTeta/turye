import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FormAlert, SubmitButton, TextField } from "../components/form";
import { isValidEmail, useAuthStore } from "../store/authStore";
import { usePageTitle } from "../lib/usePageTitle";

export default function ForgotPasswordPage() {
  usePageTitle("Reset your password");
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter the email you signed up with.");
      document.getElementById("field-email")?.focus();
      return;
    }
    setBusy(true);
    await requestPasswordReset(email);
    setBusy(false);
    setSentTo(email.trim());
  };

  return (
    <AuthLayout
      title="Reset your password"
      intro="Enter your email and we'll send you a link to choose a new password."
    >
      {sentTo ? (
        <div className="flex flex-col gap-5">
          <FormAlert tone="success">
            If an account exists for {sentTo}, a reset link is on its way. Check your inbox and spam folder.
          </FormAlert>
          <Link to="/login" className="text-center bg-green-deep text-white rounded-full py-3.5 text-sm font-semibold hover:bg-green transition-colors">
            Back to log in
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              setError("");
            }}
            error={error}
          />
          <SubmitButton busy={busy} busyLabel="Sending…" className="w-full mt-2">
            Send reset link
          </SubmitButton>
          <Link to="/login" className="self-center text-sm font-semibold text-green-deep border-b border-gold pb-0.5 mt-2">
            Back to log in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}