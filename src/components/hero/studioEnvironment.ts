import * as THREE from "three";

/**
 * Warm ivory studio probe. Area lights are emissive meshes so the PMREM
 * picks up softboxes rather than a default grey room.
 */
export function createWarmStudioEnvironment(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  geometry.deleteAttribute("uv");

  const room = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#e7d9c8"),
      roughness: 0.92,
      metalness: 0,
      side: THREE.BackSide,
    }),
  );
  room.scale.set(18, 11, 18);
  room.position.y = 1.6;
  scene.add(room);

  const floor = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#cbb8a4"),
      roughness: 1,
      metalness: 0,
    }),
  );
  floor.scale.set(18, 0.35, 18);
  floor.position.y = -0.45;
  scene.add(floor);

  const paleWall = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#efe6da"),
      roughness: 0.78,
      metalness: 0,
    }),
  );
  paleWall.scale.set(7, 4.5, 0.25);
  paleWall.position.set(0.4, 2.1, -5.2);
  scene.add(paleWall);

  const darkPanel = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#3a2f28"),
      roughness: 0.62,
      metalness: 0,
    }),
  );
  darkPanel.scale.set(0.35, 3.4, 2.4);
  darkPanel.position.set(-3.1, 1.5, 2.2);
  scene.add(darkPanel);

  scene.add(new THREE.HemisphereLight(0xf8f5f0, 0x9c8b7a, 0.85));
  const fill = new THREE.PointLight(0xf3eadf, 28, 48, 2);
  fill.position.set(1.6, 4.8, 2.4);
  scene.add(fill);

  const area = (
    intensity: number,
    color: number,
    position: [number, number, number],
    scale: [number, number, number],
  ) => {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({
        color: 0x000000,
        emissive: color,
        emissiveIntensity: intensity,
      }),
    );
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    scene.add(mesh);
  };

  area(16, 0xf8f5f0, [2.8, 5.4, 3.2], [2.6, 0.08, 1.7]);
  area(7, 0xf3eadf, [0.2, 6.2, 0.3], [2.1, 0.06, 1.3]);
  area(11, 0xe6d3b4, [-3.6, 2.7, -2.4], [0.08, 2.5, 1.15]);
  area(5, 0xe6ddd0, [-2.6, 1.5, 4.2], [1.7, 1.9, 0.08]);
  area(3, 0xd9c4ae, [0.4, 0.05, 1.6], [2.1, 0.05, 1.15]);

  scene.updateMatrixWorld(true);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(scene, 0.14, 0.1, 80, {
    position: new THREE.Vector3(0, 0.95, 0),
  });
  pmrem.dispose();

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      geometries.add(object.geometry);
      const material = object.material;
      if (Array.isArray(material)) material.forEach((entry) => materials.add(entry));
      else materials.add(material);
    }
  });
  geometries.forEach((entry) => entry.dispose());
  materials.forEach((entry) => entry.dispose());

  return target;
}
