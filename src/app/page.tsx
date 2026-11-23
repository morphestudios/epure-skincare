import { HomeCollection } from "@/components/home/HomeCollection";
import { HeroImmersive } from "@/components/hero/HeroImmersive";
import {
  MaterialScrollStory,
  RitualScrollStory,
} from "@/components/story/ScrollStory";

export default function HomePage() {
  return (
    <>
      <HeroImmersive />
      <HomeCollection />
      <RitualScrollStory />
      <MaterialScrollStory />
    </>
  );
}
