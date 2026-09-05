// Root page — composes all sections.
// GuideWidget is added as an overlay in Step 5.

import Navbar      from "@/components/nav/Navbar";
import Hero        from "@/components/sections/Hero";
import About       from "@/components/sections/About";
import Experience  from "@/components/sections/Experience";
import Projects    from "@/components/sections/Projects";
import Skills      from "@/components/sections/Skills";
import Contact     from "@/components/sections/Contact";
import Footer      from "@/components/layout/Footer";
import BootSequence from "@/components/signatures/BootSequence";
import GuideWidget  from "@/components/guide/GuideWidget";
import { GhostCursor } from "@/components/effects/GhostCursor";



export default function Home() {
  return (
    <>
      {/* Boot sequence overlay — plays once per session, then self-dismisses */}
      <BootSequence />

      <Navbar />

      {/* tabIndex={-1} lets the skip link href="#main-content" shift focus here */}
      <main id="main-content" tabIndex={-1} aria-label="Main content">

        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <Footer />

      {/* GuideWidget — fixed bottom-right, appears after BootSequence */}
      <GuideWidget />

      {/* GhostCursor — fixed Three.js canvas overlay, pointer-events: none */}
      <GhostCursor
        color="#6C63FF"
        brightness={0.9}
        trailLength={22}
        inertia={0.18}
        bloomStrength={0.025}
        mixBlendMode="screen"
        zIndex={9999}
      />


    </>
  );
}


