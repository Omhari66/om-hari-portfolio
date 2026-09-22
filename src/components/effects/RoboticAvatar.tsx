"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface RoboticAvatarProps {
  isActive: boolean;
  isSpeaking?: boolean;
  onClick?: () => void;
}

export function RoboticAvatar({ isActive, isSpeaking, onClick }: RoboticAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    // Ambient breathing effect
    const ambientTl = gsap.timeline({ repeat: -1, yoyo: true });
    ambientTl.to(imageRef.current, {
      scale: 1.02,
      duration: 4,
      ease: "sine.inOut",
    });

    return () => {
      ambientTl.kill();
    };
  }, { scope: containerRef });

  // Handle active state transition
  useGSAP(() => {
    if (isActive) {
      gsap.to(imageRef.current, {
        filter: "brightness(1.5) drop-shadow(0 0 30px rgba(124, 58, 237, 0.6))",
        scale: 1.05,
        duration: 1.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(imageRef.current, {
        filter: "brightness(0.3) drop-shadow(0 0 0px rgba(124, 58, 237, 0))",
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      });
    }
  }, [isActive]);

  // Handle speaking state
  useGSAP(() => {
    if (isSpeaking) {
      gsap.to(imageRef.current, {
        filter: "brightness(2) drop-shadow(0 0 50px rgba(8, 145, 178, 0.8))",
        duration: 0.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    } else if (isActive) {
      // return to active resting state
      gsap.to(imageRef.current, {
        filter: "brightness(1.5) drop-shadow(0 0 30px rgba(124, 58, 237, 0.6))",
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, [isSpeaking, isActive]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={{
        position: "relative",
        width: "min(90%, 500px)",
        aspectRatio: "1/1",
        cursor: onClick ? "pointer" : "default",
        // Blend seamlessly into black background
        maskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
        zIndex: 10
      }}
    >
      <Image
        ref={imageRef}
        src="/download.gif"
        alt="AI Intelligence Core"
        fill
        sizes="(max-width: 768px) 100vw, 500px"
        style={{
          objectFit: "cover",
          mixBlendMode: "screen", // ensures pure black in the jpg becomes transparent
          filter: "brightness(0.3)", // default dark state
          transformOrigin: "center center"
        }}
        priority
      />
    </div>
  );
}
