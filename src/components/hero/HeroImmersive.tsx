"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

const HeroBottleScene = dynamic(() => import("./HeroBottleScene"), {
  ssr: false,
  loading: () => null,
});

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True only for likely hardware WebGL — skip SwiftShader / software paths. */
function hasHardwareWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext("experimental-webgl", {
          failIfMajorPerformanceCaveat: true,
        })) as WebGLRenderingContext | null;
    if (!gl) return false;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = String(
        gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "",
      ).toLowerCase();
      if (
        renderer.includes("swiftshader") ||
        renderer.includes("llvmpipe") ||
        renderer.includes("softpipe") ||
        renderer.includes("software")
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function HeroImmersive() {
  const pointer = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [enable3d, setEnable3d] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [entered, setEntered] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = prefersReducedMotion();
    const wideEnough = window.innerWidth >= 1024;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const ok =
      !reduceMotion.current &&
      wideEnough &&
      finePointer &&
      hasHardwareWebGL();
    setEnable3d(ok);
    setEntered(true);
  }, []);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (reduceMotion.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const nx = Math.max(-1, Math.min(1, x));
      const ny = Math.max(-1, Math.min(1, -y));
      pointer.current = { x: nx, y: ny };

      const layer = layerRef.current;
      if (layer) {
        layer.style.setProperty("--px", `${nx * 14}px`);
        layer.style.setProperty("--py", `${ny * -10}px`);
        layer.style.setProperty("--tilt-x", `${ny * 4}deg`);
        layer.style.setProperty("--tilt-y", `${nx * 5}deg`);
      }
      const section = sectionRef.current;
      if (section) {
        section.style.setProperty("--glow-x", `${50 + nx * 8}%`);
        section.style.setProperty("--glow-y", `${42 + ny * -6}%`);
      }
    },
    [],
  );

  const showScene = enable3d && !webglFailed;

  return (
    <section
      ref={sectionRef}
      className="hero-immersive relative min-h-[min(92vh,900px)] overflow-hidden bg-espresso"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
        const layer = layerRef.current;
        if (layer) {
          layer.style.setProperty("--px", "0px");
          layer.style.setProperty("--py", "0px");
          layer.style.setProperty("--tilt-x", "0deg");
          layer.style.setProperty("--tilt-y", "0deg");
        }
        const section = sectionRef.current;
        if (section) {
          section.style.setProperty("--glow-x", "58%");
          section.style.setProperty("--glow-y", "42%");
        }
      }}
    >
      {/* Atmospheric CSS depth layers — 2.5D foundation */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="hero-glow absolute h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(232,214,190,0.32),transparent_65%)]"
          style={{
            left: "var(--glow-x, 58%)",
            top: "var(--glow-y, 42%)",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div className="hero-glow-delay absolute -right-[10%] bottom-[-8%] h-[50%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(156,139,122,0.2),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(31,27,24,0.92)_6%,rgba(58,47,40,0.55)_46%,rgba(58,47,40,0.28)_100%)]" />
        <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-[radial-gradient(ellipse_at_30%_20%,rgba(248,245,240,0.25),transparent_50%)]" />
      </div>

      {/* Genuine interactive Three.js — hardware WebGL only */}
      {showScene ? (
        <div
          className="absolute inset-0 hidden lg:block"
          onErrorCapture={() => setWebglFailed(true)}
        >
          <HeroBottleScene pointer={pointer} />
        </div>
      ) : null}

      {/* Layered 2.5D branded bottle — primary immersive visual + mobile fallback */}
      <div
        ref={layerRef}
        className={`hero-depth absolute inset-0 flex items-center justify-center lg:justify-end ${
          showScene ? "lg:opacity-0 lg:pointer-events-none" : ""
        }`}
        aria-hidden
        style={
          {
            "--px": "0px",
            "--py": "0px",
            "--tilt-x": "0deg",
            "--tilt-y": "0deg",
          } as CSSProperties
        }
      >
        <div
          className={`hero-bottle-plane relative h-[min(72vh,620px)] w-full max-w-[560px] lg:mr-[2%] lg:h-[min(82vh,720px)] lg:w-[min(52vw,600px)] ${
            entered ? "is-entered" : ""
          }`}
        >
          <div className="hero-bottle-shadow absolute inset-[18%] rounded-full bg-espresso/35 blur-3xl" />
          <div className="hero-bottle-frame absolute inset-0">
            <Image
              src="/images/lifestyle/hero-bottle-fallback.jpg"
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
          </div>
        </div>
      </div>

      <div className="container-page relative z-10 flex min-h-[min(92vh,900px)] flex-col justify-center pb-16 pt-24 md:pb-20">
        <div className="max-w-xl lg:max-w-[28rem]">
          <p
            className={`hero-enter font-display text-5xl text-ivory sm:text-6xl md:text-7xl lg:text-[5.5rem] ${
              entered ? "is-entered" : ""
            }`}
            style={{ "--enter-delay": "0ms" } as CSSProperties}
          >
            ÉPURE
          </p>
          <p
            className={`hero-enter mt-3 text-[0.72rem] uppercase tracking-[0.28em] text-sand/90 ${
              entered ? "is-entered" : ""
            }`}
            style={{ "--enter-delay": "90ms" } as CSSProperties}
          >
            The Art of Ritual
          </p>
          <h1
            className={`hero-enter mt-5 max-w-md font-display text-3xl font-normal leading-tight text-ivory/95 sm:text-4xl ${
              entered ? "is-entered" : ""
            }`}
            style={{ "--enter-delay": "160ms" } as CSSProperties}
          >
            Quiet formulas for considered skin.
          </h1>
          <p
            className={`hero-enter mt-4 max-w-sm text-[1.05rem] leading-relaxed text-ivory/78 ${
              entered ? "is-entered" : ""
            }`}
            style={{ "--enter-delay": "240ms" } as CSSProperties}
          >
            Cinematic minimalism with warm sensory luxury—edited rituals for Cape
            light and unhurried mornings.
          </p>
          <div
            className={`hero-enter mt-8 flex flex-wrap gap-3 ${
              entered ? "is-entered" : ""
            }`}
            style={{ "--enter-delay": "320ms" } as CSSProperties}
          >
            <Link href="/shop" className="btn bg-ivory text-espresso hover:bg-sand">
              Shop the collection
            </Link>
            <Link
              href="/about"
              className="btn border border-ivory/80 bg-espresso/25 text-ivory hover:bg-ivory/15"
            >
              Our approach
            </Link>
          </div>
        </div>
      </div>

      <p className="sr-only">
        ÉPURE branded hero: pointer-responsive layered product visual. Interactive
        WebGL bottle mounts only on hardware-accelerated desktops.
      </p>
    </section>
  );
}
