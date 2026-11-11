import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import type { SavedAddress, User } from "../types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FormAlert, PasswordField, SubmitButton, TextField } from "../components/form";
import {
  MIN_PASSWORD_LENGTH,
  isValidEmail,
  isValidPhone,
  useAuthStore,
  useCurrentUser,
} from "../store/authStore";
import { usePageTitle } from "../lib/usePageTitle";

export default function ProfilePage() {
  usePageTitle("Your profile");
  const user = useCurrentUser();
  const navigate = useNavigate();
  const logOut = useAuthStore((state) => state.logOut);
  const leaving = useRef(false);

  if (!user) {
    return leaving.current ? null : <Navigate to="/login?next=/profile" replace />;
  }

  const leave = (action: () => void) => {
    leaving.current = true;
    navigate("/", { replace: true });
    action();
  };

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[760px] mx-auto px-6 w-full pt-6 pb-20">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <div>
            <h1 className="font-display font-extrabold text-[2.6rem] leading-none tracking-tight text-green-deep mb-3">
              Your profile
            </h1>
            <p className="text-sm text-ink/75">
              Signed in as {user.email}
              {user.provider === "google" && " with Google"}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/orders" className="text-sm font-semibold text-green-deep border-b-2 border-gold pb-1">
              My orders
            </Link>
            <button
              type="button"
              onClick={() => leave(logOut)}
              className="bg-white border border-card-line rounded-full px-5 py-2.5 text-sm font-semibold text-green-deep hover:border-green-deep transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <DetailsSection user={user} />
          <AddressesSection addresses={user.addresses} />
          <PasswordSection user={user} />
          <DeleteSection onDeleted={(deleteAccount) => leave(deleteAccount)} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Card({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="bg-card rounded-[28px] p-6 sm:p-8">
      <h2 className="font-display font-bold text-xl text-green-deep mb-1">{title}</h2>
      {intro && <p className="text-sm text-ink/70 mb-5">{intro}</p>}
      {!intro && <div className="mb-5" />}
      {children}
    </section>
  );
}

// Shows "Saved." briefly after a successful save.
function useSavedFlag() {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);
  return [saved, setSaved] as const;
}

function DetailsSection({ user }: { user: User }) {
  const updateDetails = useAuthStore((state) => state.updateDetails);
  const [values, setValues] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useSavedFlag();

  const update = (field: keyof typeof values) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (!values.name.trim()) found.name = "Enter your name.";
    if (!isValidEmail(values.email)) found.email = "Enter a valid email address.";
    if (!isValidPhone(values.phone)) found.phone = "Enter a phone number the courier can call.";
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const result = await updateDetails(values);
    setBusy(false);
    if (result.ok) setSaved(true);
    else setFormError(result.error);
  };

  return (
    <Card title="Your details" intro="Used to fill in checkout, and so couriers can reach you.">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!user.phone && (
          <FormAlert>Add a phone number so couriers can call you when they arrive.</FormAlert>
        )}
        {formError && <FormAlert>{formError}</FormAlert>}
        <TextField id="name" label="Full name" autoComplete="name" value={values.name} onChange={update("name")} error={errors.name} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={update("email")} error={errors.email} />
          <TextField id="phone" label="Phone" type="tel" autoComplete="tel" value={values.phone} onChange={update("phone")} error={errors.phone} />
        </div>
        <div className="flex items-center gap-4">
          <SubmitButton busy={busy} busyLabel="Saving…">
            Save details
          </SubmitButton>
          {saved && (
            <span role="status" className="text-sm font-semibold text-green-deep">
              Saved.
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}

function AddressesSection({ addresses }: { addresses: SavedAddress[] }) {
  const removeAddress = useAuthStore((state) => state.removeAddress);
  const setDefaultAddress = useAuthStore((state) => state.setDefaultAddress);
  // null: no form open; "new": adding; otherwise the id being edited.
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <Card
      title="Delivery addresses"
      intro="Your default address fills in automatically at checkout."
    >
      {addresses.length === 0 && editing === null && (
        <p className="text-sm text-ink/70 mb-5">You haven't saved any addresses yet.</p>
      )}

      <ul className="flex flex-col gap-3 mb-5">
        {addresses.map((address) =>
          editing === address.id ? (
            <li key={address.id}>
              <AddressForm address={address} onDone={() => setEditing(null)} />
            </li>
          ) : (
            <li key={address.id} className="bg-white rounded-2xl border border-card-line px-5 py-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-display font-bold text-sm flex items-center gap-2">
                    {address.label}
                    {address.isDefault && (
                      <span className="text-[0.68rem] font-semibold text-green-deep bg-gold/25 rounded-full px-2.5 py-0.5">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink/75 mt-1">
                    {[address.street, address.apartment].filter(Boolean).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-green-deep">
                  {!address.isDefault && (
                    <button type="button" onClick={() => setDefaultAddress(address.id)} className="border-b border-gold pb-0.5">
                      Set as default
                    </button>
                  )}
                  <button type="button" onClick={() => setEditing(address.id)} className="border-b border-gold pb-0.5">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAddress(address.id)}
                    className="border-b border-[#E9B8AE] pb-0.5 text-[#B8321F]"
                    aria-label={`Remove ${address.label}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          )
        )}
      </ul>

      {editing === "new" ? (
        <AddressForm onDone={() => setEditing(null)} />
      ) : (
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="bg-white border border-card-line rounded-full px-5 py-2.5 text-sm font-semibold text-green-deep hover:border-green-deep transition-colors"
        >
          Add an address
        </button>
      )}
    </Card>
  );
}

function AddressForm({ address, onDone }: { address?: SavedAddress; onDone: () => void }) {
  const saveAddress = useAuthStore((state) => state.saveAddress);
  const [label, setLabel] = useState(address?.label ?? "");
  const [street, setStreet] = useState(address?.street ?? "");
  const [apartment, setApartment] = useState(address?.apartment ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const idPrefix = address ? `address-${address.id}` : "address-new";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) {
      setError("Enter the street address.");
      return;
    }
    setBusy(true);
    await saveAddress({ id: address?.id, label, street, apartment });
    setBusy(false);
    onDone();
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gold p-5 flex flex-col gap-4">
      <TextField id={`${idPrefix}-label`} label="Name for this address (optional)" value={label} onChange={setLabel} hint='For example "Home" or "Work".' />
      <TextField
        id={`${idPrefix}-street`}
        label="Street address"
        autoComplete="street-address"
        value={street}
        onChange={(v) => {
          setStreet(v);
          setError("");
        }}
        error={error}
      />
      <TextField id={`${idPrefix}-apartment`} label="Apartment, floor, or building (optional)" value={apartment} onChange={setApartment} />
      <div className="flex items-center gap-4">
        <SubmitButton busy={busy} busyLabel="Saving…">
          {address ? "Save address" : "Add address"}
        </SubmitButton>
        <button type="button" onClick={onDone} className="text-sm font-semibold text-green-deep">
          Cancel
        </button>
      </div>
    </form>
  );
}

function PasswordSection({ user }: { user: User }) {
  const changePassword = useAuthStore((state) => state.changePassword);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string }>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useSavedFlag();

  if (user.provider === "google") {
    return (
      <Card title="Password">
        <p className="text-sm text-ink/75 -mt-2">
          You sign in with Google, so there's no Turye password to change. Manage your password in your Google account.
        </p>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (!current) found.current = "Enter your current password.";
    if (next.length < MIN_PASSWORD_LENGTH) found.next = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const result = await changePassword(current, next);
    setBusy(false);
    if (result.ok) {
      setCurrent("");
      setNext("");
      setSaved(true);
    } else {
      setFormError(result.error);
    }
  };

  return (
    <Card title="Change password">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {formError && <FormAlert>{formError}</FormAlert>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordField
            id="current-password"
            label="Current password"
            autoComplete="current-password"
            value={current}
            onChange={(v) => {
              setCurrent(v);
              setErrors((er) => ({ ...er, current: undefined }));
            }}
            error={errors.current}
          />
          <PasswordField
            id="new-password"
            label="New password"
            autoComplete="new-password"
            value={next}
            onChange={(v) => {
              setNext(v);
              setErrors((er) => ({ ...er, next: undefined }));
            }}
            error={errors.next}
            hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          />
        </div>
        <div className="flex items-center gap-4">
          <SubmitButton busy={busy} busyLabel="Updating…">
            Update password
          </SubmitButton>
          {saved && (
            <span role="status" className="text-sm font-semibold text-green-deep">
              Password updated.
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}

function DeleteSection({ onDeleted }: { onDeleted: (deleteAccount: () => void) => void }) {
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="rounded-[28px] border border-[#E9B8AE] p-6 sm:p-8">
      <h2 className="font-display font-bold text-xl text-[#B8321F] mb-1">Delete account</h2>
      <p className="text-sm text-ink/70 mb-5">
        This removes your details and saved addresses. It can't be undone.
      </p>
      {confirming ? (
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => onDeleted(() => void deleteAccount())}
            className="bg-[#B8321F] text-white rounded-full px-6 py-3 text-sm font-semibold hover:brightness-110 transition-all"
          >
            Yes, delete my account
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="text-sm font-semibold text-green-deep">
            Keep my account
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="bg-white border border-[#E9B8AE] rounded-full px-5 py-2.5 text-sm font-semibold text-[#B8321F] hover:border-[#B8321F] transition-colors"
        >
          Delete account
        </button>
      )}
    </section>
  );
}