import { HeroVideo } from "./HeroVideo";
import { HeroNavbar } from "./HeroNavbar";
import { HeroStaggeredText } from "./HeroStaggeredText";
import { HeroDescription } from "./HeroDescription";
import { HeroStats } from "./HeroStats";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <HeroVideo />
      <HeroNavbar />
      <div className="relative h-full w-full">
        <HeroStaggeredText />
        <HeroDescription />
        <HeroStats />
      </div>
    </section>
  );
}
