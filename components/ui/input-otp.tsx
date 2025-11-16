"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type OTPContextValue = {
  value: string;
  setValue: (val: string) => void;
  maxLength: number;
  invalid: boolean;
  setInvalid: (v: boolean) => void;
};

const OTPContext = React.createContext<OTPContextValue | null>(null);

export interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
}

export function InputOTP({ maxLength = 6, value, onChange, className, children, ...props }: InputOTPProps) {
  const [invalid, setInvalid] = React.useState(false);
  // focus management
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const setValue = (next: string) => onChange(next);

  const sanitize = React.useCallback((raw: string) => raw.replace(/\D/g, "").slice(0, maxLength), [maxLength]);

  const flashInvalid = React.useCallback(() => {
    setInvalid(true);
    const t = setTimeout(() => setInvalid(false), 250);
    return () => clearTimeout(t);
  }, []);

  // ensure container and hidden input get focus to capture keyboard input
  React.useEffect(() => {
    containerRef.current?.focus();
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = sanitize(e.target.value);
    setValue(next);
    if (e.target.value !== next) flashInvalid();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      if (value.length < maxLength) setValue(value + key);
      return;
    }
    if (key === "Backspace") {
      e.preventDefault();
      setValue(value.slice(0, Math.max(0, value.length - 1)));
      return;
    }
    if (key === "Delete") {
      e.preventDefault();
      setValue(value.slice(0, Math.max(0, value.length - 1)));
      return;
    }
    if (key === "Tab" || key.startsWith("Arrow")) return; // allow navigation
    // any other key -> invalid feedback
    flashInvalid();
    e.preventDefault();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = sanitize(e.clipboardData.getData("text"));
    setValue(text);
    if (!/^\d*$/.test(e.clipboardData.getData("text"))) flashInvalid();
  };

  const focusContainer = () => {
    containerRef.current?.focus();
    inputRef.current?.focus();
  };

  return (
    <OTPContext.Provider value={{ value, setValue, maxLength, invalid, setInvalid }}>
      <div
        ref={containerRef}
        className={cn("flex w-full items-center justify-center", className)}
        role="group"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onClick={focusContainer}
        onMouseDown={(e) => { e.preventDefault(); focusContainer(); }}
        aria-invalid={invalid}
      >
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          autoFocus
          autoComplete="one-time-code"
          name="one-time-code"
          enterKeyHint="done"
          value={value}
          onChange={handleChange}
          className="sr-only"
          aria-label="OTP input"
          {...props}
        />
        {children}
      </div>
    </OTPContext.Provider>
  );
}

export function InputOTPGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-2", className)} {...props} />;
}

export function InputOTPSlot({ index, className }: { index: number; className?: string }) {
  const ctx = React.useContext(OTPContext);
  const char = ctx?.value?.[index] ?? "";
  const isActive = ctx ? ctx.value.length === index : false;
  const invalid = ctx?.invalid ?? false;

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background text-lg font-medium",
        "shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "ring-2 ring-ring",
        invalid && "ring-2 ring-red-500 border-red-500",
        className
      )}
      role="textbox"
      aria-label={`OTP digit ${index + 1}`}
    >
      {char || ""}
    </div>
  );
}
