import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FormAlert } from "./form";
import { useAuthStore } from "../store/authStore";

// Page frame shared by log in, sign up and forgot password.
export default function AuthLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>
      <main className="flex-1 flex justify-center px-6 pt-6 pb-20">
        <div className="w-full max-w-[440px]">
          <h1 className="font-display font-extrabold text-[2.2rem] leading-tight tracking-tight text-green-deep mb-2">
            {title}
          </h1>
          {intro && <p className="text-sm text-ink/75 mb-8">{intro}</p>}
          <div className="bg-card rounded-[28px] p-6 sm:p-8">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// "Continue with Google" plus the "or" divider under it.
// When connecting real Google sign-in, swap this for Google's official
// button (Google Identity Services draws it, logo included).
export function GoogleSignIn({ onSuccess }: { onSuccess: () => void }) {
  const continueWithGoogle = useAuthStore((state) => state.continueWithGoogle);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          const result = await continueWithGoogle();
          setBusy(false);
          if (result.ok) onSuccess();
          else setError(result.error);
        }}
        className="w-full bg-white border border-card-line rounded-full py-3.5 text-sm font-semibold text-ink hover:border-green-deep transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        {busy ? "Connecting to Google…" : "Continue with Google"}
      </button>
      {error && (
        <div className="mt-3">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      <div className="flex items-center gap-3 my-6" aria-hidden="true">
        <span className="flex-1 h-px bg-card-line" />
        <span className="text-xs font-semibold text-muted">or</span>
        <span className="flex-1 h-px bg-card-line" />
      </div>
    </>
  );
}

// Where to go after logging in: the ?next= page if it's one of ours, else the profile.
export function safeNext(next: string | null, fallback = "/profile") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}