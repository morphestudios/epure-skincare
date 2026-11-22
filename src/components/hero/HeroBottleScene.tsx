"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";

type Pointer = { x: number; y: number };

function createLabelTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#f3ebe2";
  ctx.fillRect(0, 0, 512, 640);

  ctx.strokeStyle = "rgba(58,47,40,0.18)";
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, 456, 584);

  ctx.fillStyle = "#3a2f28";
  ctx.font = "600 78px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ÉPURE", 256, 280);

  ctx.font = "500 22px 'Segoe UI', Helvetica, sans-serif";
  ctx.fillStyle = "#9c8b7a";
  ctx.fillText("THE ART OF RITUAL", 256, 360);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function EpureBottle({ pointer }: { pointer: MutableRefObject<Pointer> }) {
  const group = useRef<THREE.Group>(null);
  const labelTexture = useMemo(() => createLabelTexture(), []);

  useEffect(() => {
    return () => {
      labelTexture?.dispose();
    };
  }, [labelTexture]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const targetX = pointer.current.y * 0.18;
    const targetY = pointer.current.x * 0.42;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.07,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY + Math.sin(t * 0.4) * 0.1,
      0.07,
    );
    group.current.position.y = Math.sin(t * 0.65) * 0.035;
  });

  const amber = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#6b321c"),
        metalness: 0.22,
        roughness: 0.28,
        envMapIntensity: 0.6,
      }),
    [],
  );

  const amberDark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4a2214"),
        metalness: 0.18,
        roughness: 0.35,
      }),
    [],
  );

  const cap = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1614"),
        metalness: 0.45,
        roughness: 0.32,
      }),
    [],
  );

  return (
    <group ref={group} position={[0.55, -0.2, 0]} scale={1.2}>
      <mesh position={[0, 0.1, 0]} material={amber} castShadow>
        <cylinderGeometry args={[0.4, 0.46, 1.5, 48]} />
      </mesh>
      <mesh position={[0, 0.92, 0]} material={amber}>
        <sphereGeometry args={[0.4, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[0, 1.2, 0]} material={amberDark}>
        <cylinderGeometry args={[0.13, 0.17, 0.36, 32]} />
      </mesh>
      <mesh position={[0, 1.42, 0]} material={cap}>
        <cylinderGeometry args={[0.16, 0.16, 0.2, 32]} />
      </mesh>
      <mesh position={[0, 1.6, 0]} material={cap}>
        <sphereGeometry args={[0.15, 24, 16]} />
      </mesh>
      {labelTexture ? (
        <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry
            args={[0.405, 0.455, 0.85, 48, 1, true, -0.55, 1.1]}
          />
          <meshStandardMaterial
            map={labelTexture}
            roughness={0.9}
            metalness={0}
            side={THREE.FrontSide}
          />
        </mesh>
      ) : null}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]}>
        <circleGeometry args={[0.95, 48]} />
        <meshStandardMaterial color="#d6cdc0" roughness={0.85} metalness={0.05} />
      </mesh>
    </group>
  );
}

function SceneLights({ pointer }: { pointer: MutableRefObject<Pointer> }) {
  const key = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (!key.current) return;
    key.current.position.x = THREE.MathUtils.lerp(
      key.current.position.x,
      2.2 + pointer.current.x * 1.4,
      0.06,
    );
    key.current.position.y = THREE.MathUtils.lerp(
      key.current.position.y,
      2.8 + pointer.current.y * 0.6,
      0.06,
    );
  });

  return (
    <>
      <ambientLight intensity={0.55} color="#f7f1e8" />
      <directionalLight
        ref={key}
        intensity={1.5}
        color="#fff1df"
        position={[2.2, 2.8, 3]}
      />
      <directionalLight intensity={0.45} color="#cbbdad" position={[-2.2, 1, -1]} />
    </>
  );
}

interface HeroBottleSceneProps {
  pointer: MutableRefObject<Pointer>;
  className?: string;
}

export default function HeroBottleScene({
  pointer,
  className = "",
}: HeroBottleSceneProps) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0.45, 4.4], fov: 30, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "default",
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <Suspense fallback={null}>
          <SceneLights pointer={pointer} />
          <EpureBottle pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
