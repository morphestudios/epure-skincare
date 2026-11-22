"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { EmptyState } from "@/components/EmptyState";
import { formatZar } from "@/lib/format";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  notes: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) errors.fullName = "Full name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (values.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!values.address.trim()) errors.address = "Street address is required.";
  if (!values.city.trim()) errors.city = "City is required.";
  if (!values.province.trim()) errors.province = "Province is required.";
  if (!values.postalCode.trim()) {
    errors.postalCode = "Postal code is required.";
  } else if (!/^\d{4}$/.test(values.postalCode.trim())) {
    errors.postalCode = "Enter a 4-digit South African postal code.";
  }

  return errors;
}

export function CheckoutForm() {
  const { lines, subtotal, hydrated, clearCart } = useCart();
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const shipping = useMemo(() => (subtotal >= 1500 ? 0 : 95), [subtotal]);
  const total = subtotal + shipping;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const ref = `EP-${Date.now().toString().slice(-8)}`;
    setOrderRef(ref);
    setSubmitted(true);
    clearCart();
  }

  if (!hydrated) {
    return <div className="skeleton h-80 w-full" aria-busy="true" aria-label="Loading checkout" />;
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl border border-line bg-surface px-6 py-14 text-center sm:px-10 sm:py-16">
        <p className="eyebrow">Preview complete</p>
        <h2 className="mt-3 font-display text-4xl text-espresso md:text-5xl">Thank you</h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Your preview reference <span className="text-espresso">{orderRef}</span> was
          validated in this browser. No payment was taken and nothing will ship.
        </p>
        <p className="mx-auto mt-5 max-w-sm border-t border-line pt-5 text-sm leading-relaxed text-taupe">
          ÉPURE is a portfolio concept experience — this checkout does not process
          purchases or payments.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Return to shop
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Nothing to review"
        description="Add products to your bag before continuing to checkout."
        actionHref="/shop"
        actionLabel="Browse products"
      />
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:gap-12">
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div
          className="border border-sand bg-sand/35 px-4 py-3.5 text-sm leading-relaxed text-espresso"
          role="note"
        >
          Portfolio concept — this form does not process purchases or payments. No
          card details are requested.
        </div>

        <fieldset className="space-y-4">
          <legend className="mb-1 font-display text-2xl text-espresso">Contact</legend>
          <div>
            <label htmlFor="fullName" className="eyebrow mb-2 block">
              Full name
            </label>
            <input
              id="fullName"
              className="input"
              autoComplete="name"
              value={values.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName ? (
              <p id="fullName-error" className="field-error">
                {errors.fullName}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="eyebrow mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                autoComplete="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? <p className="field-error">{errors.email}</p> : null}
            </div>
            <div>
              <label htmlFor="phone" className="eyebrow mb-2 block">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                className="input"
                autoComplete="tel"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-line pt-8">
          <legend className="mb-1 font-display text-2xl text-espresso">Shipping</legend>
          <div>
            <label htmlFor="address" className="eyebrow mb-2 block">
              Street address
            </label>
            <input
              id="address"
              className="input"
              autoComplete="street-address"
              value={values.address}
              onChange={(event) => updateField("address", event.target.value)}
              aria-invalid={Boolean(errors.address)}
            />
            {errors.address ? <p className="field-error">{errors.address}</p> : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label htmlFor="city" className="eyebrow mb-2 block">
                City
              </label>
              <input
                id="city"
                className="input"
                autoComplete="address-level2"
                value={values.city}
                onChange={(event) => updateField("city", event.target.value)}
                aria-invalid={Boolean(errors.city)}
              />
              {errors.city ? <p className="field-error">{errors.city}</p> : null}
            </div>
            <div>
              <label htmlFor="province" className="eyebrow mb-2 block">
                Province
              </label>
              <input
                id="province"
                className="input"
                autoComplete="address-level1"
                value={values.province}
                onChange={(event) => updateField("province", event.target.value)}
                aria-invalid={Boolean(errors.province)}
              />
              {errors.province ? <p className="field-error">{errors.province}</p> : null}
            </div>
            <div>
              <label htmlFor="postalCode" className="eyebrow mb-2 block">
                Postal code
              </label>
              <input
                id="postalCode"
                className="input"
                autoComplete="postal-code"
                inputMode="numeric"
                value={values.postalCode}
                onChange={(event) => updateField("postalCode", event.target.value)}
                aria-invalid={Boolean(errors.postalCode)}
              />
              {errors.postalCode ? <p className="field-error">{errors.postalCode}</p> : null}
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="eyebrow mb-2 block">
              Order notes (optional)
            </label>
            <textarea
              id="notes"
              className="textarea"
              value={values.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <Link href="/cart" className="btn btn-secondary w-full sm:w-auto">
            Review order
          </Link>
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            Complete preview
          </button>
        </div>
      </form>

      <aside className="border border-line bg-surface p-6 sm:p-7 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl text-espresso">Order summary</h2>
        <ul className="mt-5 space-y-4">
          {lines.map((line) => (
            <li key={line.slug} className="flex justify-between gap-4 text-sm leading-snug">
              <span className="text-muted">
                {line.product.name}
                <span className="text-taupe"> × {line.quantity}</span>
              </span>
              <span className="shrink-0 text-espresso">
                {formatZar(line.product.priceZar * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <hr className="divider my-5" />
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatZar(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Shipping</span>
            <span>{shipping === 0 ? "Complimentary" : formatZar(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base text-espresso">
            <span>Total</span>
            <span>{formatZar(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
