import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ÉPURE Skincare. Contact form with client-side validation.",
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
            Questions about the assortment or textures? Send a note and we will read
            it carefully.
          </p>
          <div className="mt-10 space-y-4 text-[0.95rem] text-muted">
            <p>
              <span className="eyebrow mb-1 block">Studio</span>
              14 Buitenkant Street
              <br />
              Cape Town, 8001
            </p>
            <p>
              <span className="eyebrow mb-1 block">Email</span>
              hello@epure.studio
            </p>
            <p>
              <span className="eyebrow mb-1 block">Hours</span>
              Weekdays 09:00–17:00 SAST
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
