import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout, { GoogleSignIn, safeNext } from "../components/AuthLayout";
import { FormAlert, PasswordField, SubmitButton, TextField } from "../components/form";
import {
  MIN_PASSWORD_LENGTH,
  isValidEmail,
  isValidPhone,
  useAuthStore,
  useCurrentUser,
} from "../store/authStore";
import { usePageTitle } from "../lib/usePageTitle";

type Field = "name" | "email" | "phone" | "password";

export default function SignupPage() {
  usePageTitle("Create an account");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const user = useCurrentUser();
  const signUp = useAuthStore((state) => state.signUp);

  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user && !busy) return <Navigate to={next} replace />;

  const update = (field: Field) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) found.name = "Enter your name.";
    if (!isValidEmail(values.email)) found.email = "Enter a valid email address.";
    if (!isValidPhone(values.phone)) found.phone = "Enter a phone number the courier can call.";
    if (values.password.length < MIN_PASSWORD_LENGTH) {
      found.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length > 0) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setBusy(true);
    const result = await signUp(values);
    setBusy(false);
    if (result.ok) navigate(next, { replace: true });
    else setFormError(result.error);
  };

  const nextQuery = searchParams.get("next") ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <AuthLayout
      title="Create an account"
      intro="Save your details and addresses so checkout takes seconds next time."
    >
      <GoogleSignIn onSuccess={() => navigate(next, { replace: true })} />

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {formError && <FormAlert>{formError}</FormAlert>}
        <TextField id="name" label="Full name" autoComplete="name" value={values.name} onChange={update("name")} error={errors.name} />
        <TextField id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={update("email")} error={errors.email} />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={update("phone")}
          error={errors.phone}
          hint="Couriers call this number if they can't find you."
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          value={values.password}
          onChange={update("password")}
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        />
        <SubmitButton busy={busy} busyLabel="Creating your account…" className="w-full mt-2">
          Create account
        </SubmitButton>
      </form>

      <p className="text-sm text-center text-ink/75 mt-6">
        Already have an account?{" "}
        <Link to={`/login${nextQuery}`} className="font-semibold text-green-deep border-b border-gold pb-0.5">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}