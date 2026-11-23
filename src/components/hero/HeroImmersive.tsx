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
  type ReactNode,
  Component,
} from "react";

const HeroBottleScene = dynamic(() => import("./HeroBottleScene"), {
  ssr: false,
  loading: () => null,
});

const REST_POSE = { yaw: -0.42, pitch: 0.05 };
const PITCH_MIN = -0.16;
const PITCH_MAX = 0.2;

class HeroSceneBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

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
  const pose = useRef({ ...REST_POSE });
  const pokeRef = useRef<() => void>(() => {});
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [enable3d, setEnable3d] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [entered, setEntered] = useState(false);
  const [turning, setTurning] = useState(false);
  const [staticHero, setStaticHero] = useState(false);
  const reduceMotion = useRef(false);
  const hardwareWebGL = useRef<boolean | null>(null);

  useEffect(() => {
    const evaluate = () => {
      reduceMotion.current = prefersReducedMotion();
      if (hardwareWebGL.current === null) {
        hardwareWebGL.current = hasHardwareWebGL();
      }
      const wideEnough = window.innerWidth >= 1024;
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const ok =
        !reduceMotion.current &&
        wideEnough &&
        finePointer &&
        hardwareWebGL.current;
      setEnable3d(ok);
      setStaticHero(!ok);
      if (!ok) setSceneReady(false);
      setEntered(true);
    };
    evaluate();
    window.addEventListener("resize", evaluate);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", evaluate);
    return () => {
      window.removeEventListener("resize", evaluate);
      motion.removeEventListener("change", evaluate);
    };
  }, []);

  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleUnavailable = useCallback(() => {
    setWebglFailed(true);
    setSceneReady(false);
    setStaticHero(true);
  }, []);

  const turnBy = useCallback((dx: number, dy: number, drag: boolean) => {
    if (dx === 0 && dy === 0) return;
    const yawGain = drag ? 0.0145 : 0.009;
    const pitchGain = drag ? 0.0026 : 0.0015;
    pose.current.yaw += dx * yawGain;
    pose.current.pitch = Math.min(
      PITCH_MAX,
      Math.max(PITCH_MIN, pose.current.pitch - dy * pitchGain),
    );
    pokeRef.current();
  }, []);

  const onTurnPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      dragging.current = true;
      setTurning(true);
      lastPoint.current = { x: event.clientX, y: event.clientY };
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Capture is unavailable until the pointer is active. Hover turning still applies.
      }
    },
    [],
  );

  const onTurnPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      const previous = lastPoint.current;
      lastPoint.current = { x: event.clientX, y: event.clientY };
      if (!previous) return;
      turnBy(
        event.clientX - previous.x,
        event.clientY - previous.y,
        dragging.current,
      );
    },
    [turnBy],
  );

  const releaseTurn = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      dragging.current = false;
      setTurning(false);
      const rect = event.currentTarget.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      lastPoint.current = inside
        ? { x: event.clientX, y: event.clientY }
        : null;
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (reduceMotion.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const nx = Math.max(-1, Math.min(1, x));
      const ny = Math.max(-1, Math.min(1, -y));

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

  useEffect(() => {
    if (!showScene || sceneReady) return;
    let frames = 0;
    let frame = 0;
    const tick = () => {
      pokeRef.current();
      frames += 1;
      if (frames < 90) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [sceneReady, showScene]);

  return (
    <section
      ref={sectionRef}
      className={`hero-immersive relative min-h-[min(92vh,900px)] overflow-hidden bg-espresso ${
        staticHero ? "hero-show-still" : ""
      }`}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
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
        <div className="hero-glow-delay absolute -right-[10%] bottom-[-8%] h-[50%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(118,86,71,0.28),transparent_70%)]" />
        <div className="hero-wash absolute inset-0" />
      </div>

      {/* Genuine interactive Three.js — hardware WebGL only */}
      {showScene ? (
        <HeroSceneBoundary onFail={handleUnavailable}>
          <div
            className={`hero-canvas pointer-events-none absolute inset-0 hidden lg:block ${
              sceneReady ? "is-live" : ""
            }`}
          >
            <HeroBottleScene
              pose={pose}
              pokeRef={pokeRef}
              onReady={handleReady}
              onUnavailable={handleUnavailable}
            />
          </div>
          <div
            className={`hero-turn absolute bottom-[6%] right-[3%] top-[8%] z-[5] hidden w-[min(46vw,560px)] lg:block ${
              turning ? "is-turning" : ""
            }`}
            aria-hidden
            onPointerEnter={(event) => {
              if (event.pointerType === "touch") return;
              lastPoint.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerDown={onTurnPointerDown}
            onPointerMove={onTurnPointerMove}
            onPointerUp={releaseTurn}
            onPointerCancel={releaseTurn}
            onLostPointerCapture={() => {
              dragging.current = false;
              setTurning(false);
            }}
            onPointerLeave={() => {
              if (!dragging.current) lastPoint.current = null;
            }}
          />
        </HeroSceneBoundary>
      ) : null}

      {/* Layered 2.5D branded bottle — primary immersive visual + mobile fallback */}
      <div
        ref={layerRef}
        className="hero-still hero-depth absolute inset-0 flex items-end justify-center pb-8 lg:items-center lg:justify-end lg:pb-0"
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
          className={`hero-bottle-plane relative h-[min(46vh,420px)] w-[min(86vw,420px)] lg:mr-[6%] lg:h-[min(70vh,560px)] lg:w-[min(34vw,420px)] ${
            entered ? "is-entered" : ""
          }`}
        >
          <div className="hero-scrim pointer-events-none absolute inset-[-20%] lg:hidden" />
          <div className="hero-bottle-shadow absolute inset-[18%] rounded-full bg-espresso/35 blur-3xl" />
          <div className="hero-bottle-frame absolute inset-0">
            <Image
              src="/images/products/luminous-serum.jpg"
              alt=""
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 80vw, 40vw"
            />
          </div>
        </div>
      </div>

      <div className="hero-stage container-page pointer-events-none relative z-10">
        <div className="hero-copy pointer-events-auto">
          <p
            className={`hero-enter hero-kicker ${entered ? "is-entered" : ""}`}
            style={{ "--enter-delay": "0ms" } as CSSProperties}
          >
            The art of ritual
          </p>
          <h1
            className={`hero-enter hero-title font-display ${entered ? "is-entered" : ""}`}
            style={{ "--enter-delay": "80ms" } as CSSProperties}
          >
            Quiet
            <span className="block">formulas</span>
            <span className="hero-title-rest">for considered skin.</span>
          </h1>
          <p
            className={`hero-enter hero-deck ${entered ? "is-entered" : ""}`}
            style={{ "--enter-delay": "160ms" } as CSSProperties}
          >
            Cinematic minimalism with warm sensory luxury—edited rituals for Cape
            light and unhurried mornings.
          </p>
          <div
            className={`hero-enter hero-actions ${entered ? "is-entered" : ""}`}
            style={{ "--enter-delay": "240ms" } as CSSProperties}
          >
            <Link href="/shop" className="btn bg-ivory text-espresso hover:bg-sand">
              Shop the collection
            </Link>
            <Link href="/about" className="hero-quiet">
              Our approach
            </Link>
          </div>
        </div>
      </div>

      <p className="sr-only">
        ÉPURE branded hero. On a hardware-accelerated desktop, move or drag across
        the vessel to turn it. Leaving it keeps the angle. The page still scrolls.
        Otherwise the Luminous Serum studio photograph is shown.
      </p>
    </section>
  );
}
