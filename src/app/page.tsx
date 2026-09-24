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
import { GhostCursor } from "@/components/effects/GhostCursor";
import { DynamicStage } from "@/components/stage/DynamicStage";
import { PerspectiveGrid } from "@/components/effects/PerspectiveGrid";

export default function Home() {
  return (
    <>
      <DynamicStage />
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
    </>
  );
}


