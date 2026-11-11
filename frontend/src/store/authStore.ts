import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedAddress, User } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK AUTH. Accounts are stored in this browser only, so they don't sync
// across devices and this is not secure. When the backend exists, replace the
// insides of these actions with calls to it. The pages only use the actions
// and `currentUser`, so they won't need to change.
// ─────────────────────────────────────────────────────────────────────────────

type Result = { ok: true } | { ok: false; error: string };

interface StoredAccount extends User {
  passwordHash?: string; // absent for Google accounts
}

interface AuthState {
  accounts: StoredAccount[];
  currentUserId: string | null;

  signUp: (input: { name: string; email: string; phone: string; password: string }) => Promise<Result>;
  logIn: (email: string, password: string) => Promise<Result>;
  continueWithGoogle: () => Promise<Result>;
  logOut: () => void;
  requestPasswordReset: (email: string) => Promise<Result>;

  updateDetails: (input: { name: string; email: string; phone: string }) => Promise<Result>;
  changePassword: (current: string, next: string) => Promise<Result>;
  deleteAccount: () => Promise<Result>;

  saveAddress: (address: Omit<SavedAddress, "id" | "isDefault"> & { id?: string }) => Promise<Result>;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

// Pretend network delay, so loading states show up while testing.
const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

async function hash(text: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

const newId = () => Math.random().toString(36).slice(2, 10);
const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const current = () => get().accounts.find((a) => a.id === get().currentUserId);
      const updateCurrent = (change: (account: StoredAccount) => StoredAccount) =>
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === state.currentUserId ? change(a) : a)),
        }));

      return {
        accounts: [],
        currentUserId: null,

        signUp: async ({ name, email, phone, password }) => {
          await wait();
          const normalized = normalizeEmail(email);
          if (get().accounts.some((a) => a.email === normalized)) {
            return { ok: false, error: "An account with this email already exists. Log in instead." };
          }
          const account: StoredAccount = {
            id: newId(),
            name: name.trim(),
            email: normalized,
            phone: phone.trim(),
            provider: "password",
            addresses: [],
            createdAt: new Date().toISOString(),
            passwordHash: await hash(password),
          };
          set((state) => ({ accounts: [...state.accounts, account], currentUserId: account.id }));
          return { ok: true };
        },

        logIn: async (email, password) => {
          await wait();
          const account = get().accounts.find((a) => a.email === normalizeEmail(email));
          if (account && !account.passwordHash) {
            return { ok: false, error: "This email signs in with Google. Use Continue with Google instead." };
          }
          if (!account || account.passwordHash !== (await hash(password))) {
            return { ok: false, error: "Email or password is incorrect." };
          }
          set({ currentUserId: account.id });
          return { ok: true };
        },

        // MOCK: signs in as a stand-in Google account. The real version opens
        // Google's sign-in window and gets the person's name and email from it.
        continueWithGoogle: async () => {
          await wait();
          const email = "google.user@example.com";
          const existing = get().accounts.find((a) => a.email === email);
          if (existing) {
            set({ currentUserId: existing.id });
            return { ok: true };
          }
          const account: StoredAccount = {
            id: newId(),
            name: "Google User",
            email,
            phone: "",
            provider: "google",
            addresses: [],
            createdAt: new Date().toISOString(),
          };
          set((state) => ({ accounts: [...state.accounts, account], currentUserId: account.id }));
          return { ok: true };
        },

        logOut: () => set({ currentUserId: null }),

        // Always reports success, so the page never reveals which emails have accounts.
        requestPasswordReset: async () => {
          await wait();
          return { ok: true };
        },

        updateDetails: async ({ name, email, phone }) => {
          await wait();
          const me = current();
          if (!me) return { ok: false, error: "You're not logged in." };
          const normalized = normalizeEmail(email);
          if (get().accounts.some((a) => a.email === normalized && a.id !== me.id)) {
            return { ok: false, error: "Another account already uses this email." };
          }
          updateCurrent((a) => ({ ...a, name: name.trim(), email: normalized, phone: phone.trim() }));
          return { ok: true };
        },

        changePassword: async (currentPassword, next) => {
          await wait();
          const me = current();
          if (!me?.passwordHash) return { ok: false, error: "This account doesn't use a password." };
          if (me.passwordHash !== (await hash(currentPassword))) {
            return { ok: false, error: "Your current password is incorrect." };
          }
          const passwordHash = await hash(next);
          updateCurrent((a) => ({ ...a, passwordHash }));
          return { ok: true };
        },

        deleteAccount: async () => {
          await wait();
          set((state) => ({
            accounts: state.accounts.filter((a) => a.id !== state.currentUserId),
            currentUserId: null,
          }));
          return { ok: true };
        },

        saveAddress: async ({ id, label, street, apartment }) => {
          await wait(250);
          updateCurrent((a) => {
            const fields = { label: label.trim() || "Address", street: street.trim(), apartment: apartment.trim() };
            if (id) {
              return { ...a, addresses: a.addresses.map((ad) => (ad.id === id ? { ...ad, ...fields } : ad)) };
            }
            // The first address saved becomes the default.
            const added: SavedAddress = { id: newId(), ...fields, isDefault: a.addresses.length === 0 };
            return { ...a, addresses: [...a.addresses, added] };
          });
          return { ok: true };
        },

        removeAddress: (id) =>
          updateCurrent((a) => {
            const remaining = a.addresses.filter((ad) => ad.id !== id);
            // If the default was removed, the next address takes over.
            if (remaining.length > 0 && !remaining.some((ad) => ad.isDefault)) {
              remaining[0] = { ...remaining[0], isDefault: true };
            }
            return { ...a, addresses: remaining };
          }),

        setDefaultAddress: (id) =>
          updateCurrent((a) => ({
            ...a,
            addresses: a.addresses.map((ad) => ({ ...ad, isDefault: ad.id === id })),
          })),
      };
    },
    { name: "turye-auth" }
  )
);

// The logged-in customer, or null. Never includes the password hash.
export function useCurrentUser(): User | null {
  const account = useAuthStore((state) => state.accounts.find((a) => a.id === state.currentUserId));
  if (!account) return null;
  const { passwordHash: _omit, ...user } = account;
  return user;
}

export const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email.trim());
export const isValidPhone = (phone: string) => phone.replace(/\D/g, "").length >= 7;
export const MIN_PASSWORD_LENGTH = 8;