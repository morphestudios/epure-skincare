"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import {
  createHeroTextures,
  createWordmarkTexture,
  disposeHeroTextures,
  type HeroTextures,
} from "./heroTextures";
import { createWarmStudioEnvironment } from "./studioEnvironment";
import {
  VESSEL,
  createCapGeometry,
  createMeniscusGeometry,
  createPlinthGeometry,
  createSerumGeometry,
  createVesselBodyGeometry,
  createWordmarkGeometry,
} from "./vesselGeometry";

export type VesselPose = { yaw: number; pitch: number };

const HERO_FOV = 28;
const HERO_DISTANCE = 5.85;
const REST_YAW = -0.42;
const REST_PITCH = 0.05;

function frameHeroCamera(camera: THREE.PerspectiveCamera, aspect: number) {
  const safeAspect = Math.max(aspect, 0.8);
  camera.fov = HERO_FOV;
  camera.near = 0.08;
  camera.far = 48;
  camera.aspect = safeAspect;
  const halfWidth =
    Math.tan((HERO_FOV * Math.PI) / 360) * HERO_DISTANCE * safeAspect;
  const lookX = -(0.74 - 0.5) * 2 * halfWidth;
  camera.position.set(lookX, 1.92, HERO_DISTANCE);
  camera.lookAt(lookX, 0.94, 0);
  camera.updateProjectionMatrix();
}

function StudioRig({
  onLive,
  onUnavailable,
}: {
  onLive: (live: boolean) => void;
  onUnavailable?: () => void;
}) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const scene = useThree((state) => state.scene);
  const onLiveRef = useRef(onLive);
  const onUnavailableRef = useRef(onUnavailable);
  const invalidateRef = useRef(invalidate);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    invalidateRef.current = invalidate;
  }, [invalidate]);

  useEffect(() => {
    onLiveRef.current = onLive;
    onUnavailableRef.current = onUnavailable;
  }, [onLive, onUnavailable]);

  useEffect(() => {
    const canvas = gl.domElement;
    const onRestored = () => setGeneration((current) => current + 1);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => canvas.removeEventListener("webglcontextrestored", onRestored);
  }, [gl]);

  useEffect(() => {
    let cancelled = false;
    let target: THREE.WebGLRenderTarget | null = null;
    let raf = 0;
    const kick = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        target = createWarmStudioEnvironment(gl);
      } catch {
        onUnavailableRef.current?.();
        return;
      }
      setTexture(target.texture);
      onLiveRef.current(true);
      let frames = 0;
      const pump = () => {
        if (cancelled) return;
        invalidateRef.current();
        frames += 1;
        if (frames < 8) raf = requestAnimationFrame(pump);
      };
      pump();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(kick);
      cancelAnimationFrame(raf);
      target?.dispose();
    };
  }, [gl, generation]);

  useEffect(() => {
    if (!texture) return;
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.forEach((material) => {
        material.needsUpdate = true;
      });
    });
    invalidate();
  }, [invalidate, scene, texture]);

  if (!texture) return null;
  return <primitive object={texture} attach="environment" />;
}

function CameraAndBackdrop({ backdrop }: { backdrop: THREE.Texture }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const mesh = useRef<THREE.Mesh>(null);

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera) || !mesh.current) return;
    frameHeroCamera(camera, size.width / Math.max(size.height, 1));
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const distance = 8.6;
    mesh.current.position.copy(camera.position).addScaledVector(direction, distance);
    mesh.current.lookAt(camera.position);
    const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * distance;
    const width = height * camera.aspect;
    mesh.current.scale.set(width * 1.04, height * 1.04, 1);
  }, [camera, size]);

  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-2}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={backdrop} side={THREE.DoubleSide} />
    </mesh>
  );
}

function KeyLight() {
  const light = useRef<THREE.DirectionalLight>(null);
  const target = useRef<THREE.Object3D>(null);

  useLayoutEffect(() => {
    if (light.current && target.current) {
      light.current.target = target.current;
    }
  }, []);

  return (
    <>
      <object3D ref={target} position={[0, 0.95, 0]} />
      <directionalLight
        ref={light}
        castShadow
        color="#f4ebe0"
        intensity={1.28}
        position={[2.15, 3.7, 3.4]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-2.1}
        shadow-camera-right={2.1}
        shadow-camera-top={2.4}
        shadow-camera-bottom={-2.4}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
    </>
  );
}

function Vessel({
  pose,
  textures,
  wordmark,
}: {
  pose: MutableRefObject<VesselPose>;
  textures: HeroTextures;
  wordmark: THREE.Texture | null;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const group = useRef<THREE.Group>(null);
  const motion = useRef({
    pitch: REST_PITCH,
    yaw: REST_YAW,
    pitchVelocity: 0,
    yawVelocity: 0,
  });

  const geometries = useMemo(
    () => ({
      body: createVesselBodyGeometry(),
      serum: createSerumGeometry(),
      meniscus: createMeniscusGeometry(),
      cap: createCapGeometry(),
      mark: createWordmarkGeometry(),
      plinth: createPlinthGeometry(),
      contact: new THREE.CircleGeometry(0.46, 48),
    }),
    [],
  );

  const materials = useMemo(() => {
    const glass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#fff8f2"),
      metalness: 0,
      roughness: 0.07,
      roughnessMap: textures.glassRoughness,
      normalMap: textures.glassNormal,
      normalScale: new THREE.Vector2(0.04, 0.04),
      transmission: 1,
      thickness: 1.2,
      thicknessMap: textures.glassThickness,
      ior: 1.5,
      attenuationColor: new THREE.Color("#9a5528"),
      attenuationDistance: 1.85,
      envMapIntensity: 0.78,
      clearcoat: 0.03,
      clearcoatRoughness: 0.46,
      specularIntensity: 0.42,
      specularColor: new THREE.Color("#f6efe6"),
      transparent: true,
      opacity: 1,
      dithering: true,
    });
    const serum = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#7a4a28"),
      roughness: 0.46,
      metalness: 0,
      emissive: new THREE.Color("#3a2010"),
      emissiveIntensity: 0.045,
      envMapIntensity: 0.12,
      dithering: true,
    });
    const meniscus = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#b08458"),
      roughness: 0.32,
      metalness: 0.04,
      emissive: new THREE.Color("#3a2414"),
      emissiveIntensity: 0.02,
      envMapIntensity: 0.22,
    });
    const cap = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#b5a48c"),
      metalness: 1,
      roughness: 0.5,
      roughnessMap: textures.brush,
      anisotropy: 0.38,
      anisotropyRotation: Math.PI / 2,
      envMapIntensity: 0.52,
      clearcoat: 0.015,
      clearcoatRoughness: 0.6,
      dithering: true,
    });
    const stone = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#5c4a3c"),
      roughness: 0.96,
      metalness: 0,
    });
    const shadow = new THREE.MeshBasicMaterial({
      map: textures.contact,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    return { glass, serum, meniscus, cap, stone, shadow };
  }, [textures]);

  const markMaterial = useMemo(() => {
    if (!wordmark) return null;
    return new THREE.MeshStandardMaterial({
      map: wordmark,
      color: new THREE.Color("#f7f3ee"),
      transparent: true,
      roughness: 0.72,
      metalness: 0.08,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    });
  }, [wordmark]);

  useEffect(() => {
    const geometryList = Object.values(geometries);
    const materialList = Object.values(materials);
    return () => {
      geometryList.forEach((geometry) => geometry.dispose());
      materialList.forEach((material) => material.dispose());
    };
  }, [geometries, materials]);

  useEffect(() => {
    return () => {
      markMaterial?.dispose();
    };
  }, [markMaterial]);

  useFrame((_, delta) => {
    const current = group.current;
    if (!current) return;
    const dt = Math.min(delta, 0.033);
    const targetPitch = pose.current.pitch;
    const targetYaw = pose.current.yaw;
    const stiffness = 22;
    const damping = 13;
    const motionState = motion.current;
    motionState.pitchVelocity +=
      ((targetPitch - motionState.pitch) * stiffness -
        motionState.pitchVelocity * damping) *
      dt;
    motionState.yawVelocity +=
      ((targetYaw - motionState.yaw) * stiffness -
        motionState.yawVelocity * damping) *
      dt;
    motionState.pitch += motionState.pitchVelocity * dt;
    motionState.yaw += motionState.yawVelocity * dt;
    current.rotation.x = motionState.pitch;
    current.rotation.y = motionState.yaw;
    const settling =
      Math.abs(targetYaw - motionState.yaw) > 0.0006 ||
      Math.abs(targetPitch - motionState.pitch) > 0.0006 ||
      Math.abs(motionState.yawVelocity) > 0.0006 ||
      Math.abs(motionState.pitchVelocity) > 0.0006;
    if (settling) {
      invalidate();
    } else {
      motionState.yaw = targetYaw;
      motionState.pitch = targetPitch;
      motionState.yawVelocity = 0;
      motionState.pitchVelocity = 0;
    }
  });

  return (
    <>
      <mesh
        geometry={geometries.plinth}
        material={materials.stone}
        position={[0.02, 0, 0.01]}
        scale={[0.92, 1, 0.72]}
        receiveShadow
        dispose={null}
      />
      <mesh
        geometry={geometries.contact}
        material={materials.shadow}
        rotation={[-Math.PI / 2, 0, 0.12]}
        position={[0.01, 0.004, 0.02]}
        scale={[1.08, 1, 0.74]}
        renderOrder={1}
        dispose={null}
      />

      <group ref={group} rotation={[REST_PITCH, REST_YAW, 0]}>
        <mesh
          geometry={geometries.body}
          material={materials.glass}
          castShadow
          dispose={null}
        />
        <mesh
          geometry={geometries.serum}
          material={materials.serum}
          castShadow
          dispose={null}
        />
        <mesh
          geometry={geometries.meniscus}
          material={materials.meniscus}
          dispose={null}
        />
        <mesh
          geometry={geometries.cap}
          material={materials.cap}
          position={[0, VESSEL.bodyHeight - VESSEL.capOverlap, 0]}
          castShadow
          dispose={null}
        />
        {markMaterial ? (
          <mesh
            geometry={geometries.mark}
            material={markMaterial}
            dispose={null}
          />
        ) : null}
        <pointLight
          color="#c4925a"
          intensity={0.4}
          distance={1.5}
          decay={2}
          position={[0.02, 0.72, 0.03]}
        />
      </group>
    </>
  );
}

function Settle({
  armed,
  envLive,
  onReady,
}: {
  armed: boolean;
  envLive: boolean;
  onReady?: () => void;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const sent = useRef(false);
  const frames = useRef(0);
  const ready = armed && envLive;

  useEffect(() => {
    frames.current = 0;
    sent.current = false;
    if (ready) invalidate();
  }, [invalidate, ready]);

  useFrame(() => {
    if (!ready || sent.current) return;
    frames.current += 1;
    if (frames.current >= 4) {
      sent.current = true;
      onReady?.();
    } else {
      invalidate();
    }
  });
  return null;
}

function ResizeInvalidate() {
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate, size]);
  return null;
}

function RenderBridge({
  pokeRef,
}: {
  pokeRef: MutableRefObject<() => void>;
}) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    pokeRef.current = invalidate;
    invalidate();
    return () => {
      pokeRef.current = () => {};
    };
  }, [invalidate, pokeRef]);
  return null;
}

function ContextGuard({ onUnavailable }: { onUnavailable?: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
      onUnavailable?.();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl, onUnavailable]);
  return null;
}

interface HeroBottleSceneProps {
  pose: MutableRefObject<VesselPose>;
  pokeRef: MutableRefObject<() => void>;
  className?: string;
  onReady?: () => void;
  onUnavailable?: () => void;
}

export default function HeroBottleScene({
  pose,
  pokeRef,
  className = "",
  onReady,
  onUnavailable,
}: HeroBottleSceneProps) {
  const textures = useMemo(() => createHeroTextures(), []);
  const wordmark = useRef<THREE.CanvasTexture | null>(null);
  const [brand, setBrand] = useState<THREE.CanvasTexture | null | undefined>(
    undefined,
  );
  const [envLive, setEnvLive] = useState(false);
  const handleEnv = useCallback((live: boolean) => setEnvLive(live), []);

  useEffect(() => {
    let alive = true;
    const timeout = window.setTimeout(() => {
      if (alive) setBrand((current) => current ?? wordmark.current);
    }, 900);
    const load = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // Georgia covers the wordmark if the display face is not ready.
      }
      if (!alive) return;
      const family = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-display")
        .split(",")[0]
        .trim()
        .replace(/^['"]|['"]$/g, "");
      const texture = createWordmarkTexture(family);
      if (!alive) {
        texture?.dispose();
        return;
      }
      wordmark.current = texture;
      setBrand(texture);
    };
    void load();
    return () => {
      alive = false;
      window.clearTimeout(timeout);
      wordmark.current?.dispose();
      wordmark.current = null;
    };
  }, []);

  useEffect(() => {
    return () => disposeHeroTextures(textures);
  }, [textures]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") pokeRef.current();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [pokeRef]);

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        shadows="percentage"
        camera={{
          fov: HERO_FOV,
          near: 0.08,
          far: 48,
          position: [0, 1.92, HERO_DISTANCE],
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: true,
        }}
        frameloop="demand"
        onCreated={({ gl, camera }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(0x251a17, 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.92;
          gl.domElement.style.touchAction = "pan-y";
          if (camera instanceof THREE.PerspectiveCamera) {
            const rect = gl.domElement.getBoundingClientRect();
            frameHeroCamera(camera, rect.width / Math.max(rect.height, 1));
          }
        }}
      >
        <StudioRig onLive={handleEnv} onUnavailable={onUnavailable} />
        <CameraAndBackdrop backdrop={textures.backdrop} />
        <hemisphereLight args={["#f3eee5", "#b8a08b", 0.22]} />
        <directionalLight
          color="#f3eadf"
          intensity={0.26}
          position={[-3.1, 1.6, 2.8]}
        />
        <directionalLight
          color="#e6d3b4"
          intensity={0.4}
          position={[-2.4, 2.5, -2.2]}
        />
        <KeyLight />
        <Vessel pose={pose} textures={textures} wordmark={brand ?? null} />
        <RenderBridge pokeRef={pokeRef} />
        <ResizeInvalidate />
        <Settle
          armed={brand !== undefined}
          envLive={envLive}
          onReady={onReady}
        />
        <ContextGuard onUnavailable={onUnavailable} />
      </Canvas>
    </div>
  );
}
