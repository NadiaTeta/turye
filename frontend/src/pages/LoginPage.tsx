import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout, { GoogleSignIn, safeNext } from "../components/AuthLayout";
import { FormAlert, PasswordField, SubmitButton, TextField } from "../components/form";
import { isValidEmail, useAuthStore, useCurrentUser } from "../store/authStore";
import { usePageTitle } from "../lib/usePageTitle";

export default function LoginPage() {
  usePageTitle("Log in");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const user = useCurrentUser();
  const logIn = useAuthStore((state) => state.logIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user && !busy) return <Navigate to={next} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (!isValidEmail(email)) found.email = "Enter the email you signed up with.";
    if (!password) found.password = "Enter your password.";
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length > 0) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setBusy(true);
    const result = await logIn(email, password);
    setBusy(false);
    if (result.ok) navigate(next, { replace: true });
    else setFormError(result.error);
  };

  const nextQuery = searchParams.get("next") ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <AuthLayout title="Log in" intro="Welcome back. Log in to use your saved details at checkout.">
      <GoogleSignIn onSuccess={() => navigate(next, { replace: true })} />

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {formError && <FormAlert>{formError}</FormAlert>}
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setErrors((er) => ({ ...er, email: undefined }));
          }}
          error={errors.email}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setErrors((er) => ({ ...er, password: undefined }));
          }}
          error={errors.password}
        />
        <Link
          to="/forgot-password"
          className="self-start text-xs font-semibold text-green-deep border-b border-gold pb-0.5 -mt-1"
        >
          Forgot password?
        </Link>
        <SubmitButton busy={busy} busyLabel="Logging in…" className="w-full mt-2">
          Log in
        </SubmitButton>
      </form>

      <p className="text-sm text-center text-ink/75 mt-6">
        New to Turye?{" "}
        <Link to={`/signup${nextQuery}`} className="font-semibold text-green-deep border-b border-gold pb-0.5">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}