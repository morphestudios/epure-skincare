import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ÉPURE Skincare. Contact form with client-side validation.",
};

export default function ContactPage() {
  return (
    <div className="grid lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
      <aside className="bg-espresso text-ivory">
        <div className="section-pad px-6 sm:px-10 lg:px-14">
          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-sand">Contact</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Say hello</h1>
          <p className="mt-5 max-w-sm text-sand">
            Questions about the assortment or textures? Send a note. This page is a
            demonstration: messages are checked in the browser and are not delivered.
          </p>
          <dl className="mt-12 space-y-8 text-[0.95rem]">
            <div>
              <dt className="text-[0.72rem] uppercase tracking-[0.18em] text-sand">Studio</dt>
              <dd className="mt-2 text-ivory">
                14 Buitenkant Street
                <br />
                Cape Town, 8001
              </dd>
            </div>
            <div>
              <dt className="text-[0.72rem] uppercase tracking-[0.18em] text-sand">Email</dt>
              <dd className="mt-2">
                <a className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory" href="mailto:hello@epure.studio">
                  hello@epure.studio
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.72rem] uppercase tracking-[0.18em] text-sand">Hours</dt>
              <dd className="mt-2">Weekdays 09:00–17:00 SAST</dd>
            </div>
          </dl>
        </div>
      </aside>
      <div className="section-pad">
        <div className="mx-auto w-full max-w-lg px-6 sm:px-0">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
