"use client";

import { useState, type FormEvent } from "react";

interface ContactState {
  name: string;
  email: string;
  message: string;
}

interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: ContactErrors = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!values.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!values.message.trim() || values.message.trim().length < 10) {
      next.message = "Please share a short message (at least 10 characters).";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-line bg-surface px-6 py-10">
        <h2 className="font-display text-3xl text-espresso">Message received</h2>
        <p className="mt-3 text-muted">
          Thank you — your note was validated locally. For this concept site, messages
          are not delivered to a live inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="contact-name" className="eyebrow mb-2 block">
          Name
        </label>
        <input
          id="contact-name"
          className="input"
          autoComplete="name"
          required
          aria-required="true"
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? (
          <p id="contact-name-error" className="field-error" role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="contact-email" className="eyebrow mb-2 block">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          className="input"
          autoComplete="email"
          required
          aria-required="true"
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          value={values.email}
          onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? (
          <p id="contact-email-error" className="field-error" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="contact-message" className="eyebrow mb-2 block">
          Message
        </label>
        <textarea
          id="contact-message"
          className="textarea"
          required
          aria-required="true"
          aria-describedby={errors.message ? "contact-message-error" : "contact-demo-note"}
          value={values.message}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, message: event.target.value }))
          }
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <p id="contact-message-error" className="field-error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>
      <p id="contact-demo-note" className="text-sm text-muted">
        Demonstration only. A valid note stays in this browser and is not emailed.
      </p>
      <button type="submit" className="btn btn-primary">
        Send message
      </button>
    </form>
  );
}
