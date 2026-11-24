import type { Metadata } from "next";
import { HeroImmersive } from "@/components/hero/HeroImmersive";
import { HeroStudy } from "@/components/hero/HeroStudy";

export const metadata: Metadata = {
  title: "Hero study",
  description:
    "Visual review comparing the homepage vessel with a photographic study.",
  robots: { index: false, follow: false },
};

export default function HeroPreviewPage() {
  return (
    <>
      <p className="hero-study-note">A — Current homepage vessel</p>
      <HeroImmersive />
      <p className="hero-study-note">B — Photographic study, not the live homepage</p>
      <HeroStudy />
    </>
  );
}
