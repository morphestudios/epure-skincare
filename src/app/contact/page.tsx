import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ÉPURE Skincare. Demo contact form with client-side validation.",
};

export default function ContactPage() {
  return (
    <div className="section-pad">
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 font-display text-5xl text-espresso md:text-6xl">
            Say hello
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Questions about the assortment, textures, or this portfolio demo? Send a
            note. The form validates locally and does not deliver to a live inbox.
          </p>
          <div className="mt-10 space-y-4 text-[0.95rem] text-muted">
            <p>
              <span className="eyebrow block mb-1">Studio</span>
              14 Buitenkant Street
              <br />
              Cape Town, 8001
            </p>
            <p>
              <span className="eyebrow block mb-1">Email</span>
              hello@epureskincare.demo
            </p>
            <p>
              <span className="eyebrow block mb-1">Hours</span>
              Weekdays 09:00–17:00 SAST
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
