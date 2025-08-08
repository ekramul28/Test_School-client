import Contact from "./Contact";

import Features from "./Features";
import Hero from "./Hero";
import Statistics from "./Statistics";
import Testimonials from "./Testimonials";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

export default function Home() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <div className="min-h-screen flex flex-col ">
      <Hero />
      <main className="flex-grow  w-9/12 mx-auto">
        <Features />

        <Testimonials />
        <Statistics />
        <Contact />
      </main>
    </div>
  );
}
