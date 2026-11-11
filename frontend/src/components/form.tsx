import { useState } from "react";

// Shared form fields used by checkout and the account pages.

export function inputClass(hasError: boolean) {
  return `w-full bg-white rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-green-deep focus-visible:ring-2 focus-visible:ring-gold/40 ${
    hasError ? "border-[#D6432E]" : "border-card-line"
  }`;
}

export function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-xs font-semibold text-[#B8321F] mt-1.5">
      {children}
    </p>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  hint?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  multiline = false,
  hint,
}: TextFieldProps) {
  const fieldId = `field-${id}`;
  const errorId = `error-${id}`;
  const hintId = `hint-${id}`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  const shared = {
    id: fieldId,
    value,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    className: inputClass(Boolean(error)),
  };

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-semibold mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared.className} resize-y`}
        />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted mt-1.5">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  hint,
}: Omit<TextFieldProps, "type" | "multiline">) {
  const [visible, setVisible] = useState(false);
  const fieldId = `field-${id}`;
  const errorId = `error-${id}`;
  const hintId = `hint-${id}`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-semibold mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${inputClass(Boolean(error))} pr-16`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-deep px-2 py-1"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted mt-1.5">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

// A form-level message, e.g. "Email or password is incorrect."
export function FormAlert({ tone = "error", children }: { tone?: "error" | "success"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`text-sm rounded-2xl border px-4 py-3 ${
        tone === "error"
          ? "bg-white border-[#E9B8AE] text-[#B8321F] font-semibold"
          : "bg-white border-gold text-green-deep font-semibold"
      }`}
    >
      {children}
    </p>
  );
}

export function SubmitButton({
  busy,
  children,
  busyLabel,
  className = "",
}: {
  busy: boolean;
  children: React.ReactNode;
  busyLabel: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className={`bg-green-deep text-white rounded-full py-3.5 px-7 text-sm font-semibold hover:bg-green transition-colors disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {busy ? busyLabel : children}
    </button>
  );
}