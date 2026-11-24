import * as THREE from "three";

/** @typedef {{ x: number, y: number, shadow: number }} SunSample */

const paper = 0xf0ebde;
const moss = 0x344534;
const brass = 0x9b6329;
const dayBackground = new THREE.Color(paper);
const nightBackground = new THREE.Color(0xdbdfd1);

/** @param {string} text @param {number} width */
function plaque(text, width) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = 146;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo dibujar la señalética");
  context.fillStyle = "#344534";
  context.fillRect(1, 1, width - 2, 144);
  context.strokeStyle = "#c7b183";
  context.lineWidth = 3;
  context.strokeRect(10, 10, width - 20, 126);
  context.fillStyle = "#fcf7ea";
  context.font = "600 64px system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, width / 2, 75, width - 44);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Sprite(new THREE.SpriteMaterial({ map, depthTest: false }));
}

/** @param {HTMLCanvasElement} canvas @param {number} front @param {number} depth */
export function createSolarLotScene(canvas, front, depth) {
  const context = canvas.getContext("webgl2", { alpha: false, antialias: true, powerPreference: "low-power" });
  if (!context) throw new Error("WebGL2 no disponible");

  const scene = new THREE.Scene();
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const light = new THREE.DirectionalLight(0xffe4bd, 2.2);
  /** @type {THREE.WebGLRenderer | undefined} */
  let renderer;
  function dispose() {
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    light.shadow.dispose();
    renderer?.dispose();
    if (!context?.isContextLost()) context?.getExtension("WEBGL_lose_context")?.loseContext();
  }

  try {
    const webgl = renderer = new THREE.WebGLRenderer({ canvas, context });
    webgl.shadowMap.enabled = true;
    webgl.shadowMap.type = THREE.PCFShadowMap;
    webgl.toneMapping = THREE.ACESFilmicToneMapping;
    webgl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    const target = new THREE.Vector3(0, 0.45, 0.85);
    const initial = { azimuth: 0.63, tilt: 0.76, zoom: 1 };
    const view = { ...initial };
    const fill = new THREE.HemisphereLight(0xfff6e2, 0x918c70, 1.9);
    scene.add(fill, light);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.left = light.shadow.camera.bottom = -13;
    light.shadow.camera.right = light.shadow.camera.top = 13;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 70;
    light.shadow.normalBias = 0.028;
    light.shadow.radius = 2;
    light.shadow.camera.updateProjectionMatrix();

    /** @template T @param {T} material @returns {T} */
    function track(material) { materials.add(material); return material; }
    /** @param {number} color */
    const matte = (color) => track(new THREE.MeshStandardMaterial({ color, roughness: 0.94 }));
    /** @param {THREE.BufferGeometry} geometry @param {THREE.Material} material @param {THREE.Object3D} [parent] */
    function mesh(geometry, material, parent = scene) {
      geometries.add(geometry);
      const part = new THREE.Mesh(geometry, material);
      parent.add(part);
      return part;
    }
    /** @param {THREE.Material} material @param {number} w @param {number} h @param {number} d @param {number} x @param {number} y @param {number} z @param {THREE.Object3D} [parent] */
    function box(material, w, h, d, x, y, z, parent) {
      const part = mesh(new THREE.BoxGeometry(w, h, d), material, parent);
      part.position.set(x, y, z);
      part.receiveShadow = true;
      return part;
    }

    // Z negativo es norte; la calle queda al sur, como en el SVG.
    // Se normaliza el fondo y se conserva la proporción; ninguna altura es métrica.
    const d = 12;
    const w = d * front / depth;
    const halfD = d / 2;
    const halfW = w / 2;
    const grade = 0.64;
    const paving = matte(0xc0b49a);
    const ivory = matte(0xe0d6bc);
    const landscape = matte(0x9ca67c);
    const lawnTrim = matte(0xb3b78e);
    const dark = matte(moss);
    const road = matte(0x73776a);

    const grid = new THREE.GridHelper(80, 46, 0xcbc3b1, 0xd4ccbb);
    grid.position.y = -0.59;
    grid.material.transparent = true;
    grid.material.opacity = 0.44;
    grid.material.depthWrite = false;
    geometries.add(grid.geometry);
    materials.add(grid.material);
    scene.add(grid);
    const table = mesh(new THREE.PlaneGeometry(100, 100), track(new THREE.ShadowMaterial({ opacity: 0.18 })));
    table.rotation.x = -Math.PI / 2;
    table.position.y = -0.52;
    table.receiveShadow = true;

    box(dark, w + 4.15, 0.82, d + 5.2, 0, -0.06, 1.22);
    box(paving, w + 4.21, 0.15, d + 5.24, 0, 0.425, 1.22);
    box(landscape, w, 0.14, d, 0, grade - 0.07, 0);
    box(road, w + 3.96, 0.02, 2.48, 0, 0.512, halfD + 2.38);
    box(ivory, w + 4.02, 0.19, 0.24, 0, 0.539, halfD + 0.99);
    box(ivory, w + 4.02, 0.06, 0.17, 0, 0.518, halfD + 3.68);
    for (let x = -halfW - 1.15; x <= halfW + 1.3; x += 1.55) {
      box(ivory, 0.63, 0.017, 0.052, x, 0.53, halfD + 2.43);
    }

    for (const x of [-halfW, halfW]) box(dark, 0.047, 0.021, d, x, grade, 0);
    for (const z of [-halfD, halfD]) box(dark, w, 0.023, 0.058, 0, grade, z);
    for (const x of [-halfW, halfW]) {
      for (const z of [-halfD, halfD]) box(ivory, 0.16, 0.12, 0.16, x, grade, z);
    }
    // Capas y arbolado discretos, como en una maqueta de taller.
    box(lawnTrim, 0.62, 0.021, d - 1.07, halfW - 0.55, grade, 0);
    box(lawnTrim, w - 1.06, 0.021, 0.62, 0, grade, -halfD + 0.55);
    const foliage = [matte(0x536843), matte(0x687950)];
    const bark = matte(0x756349);
    for (const [x, z, r, i] of [
      [-halfW + 0.76, -3.65, 0.48, 0], [-halfW + 1.3, -4.77, 0.54, 1],
      [halfW - 0.85, -4.77, 0.63, 0], [halfW - 0.57, -3.4, 0.39, 1],
      [halfW - 0.67, 3.6, 0.44, 0],
    ]) {
      const trunk = mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.54, 7), bark);
      trunk.position.set(x, grade + 0.26, z);
      const crown = mesh(new THREE.IcosahedronGeometry(r, 1), foliage[i]);
      crown.scale.set(0.94, 1.23, 0.9);
      crown.position.set(x, grade + 0.45 + r * 0.65, z);
      crown.receiveShadow = true;
    }

    const volume = new THREE.Group();
    scene.add(volume);
    const buildingW = w / 2;
    const buildingD = d / 4;
    const facade = matte(0xbab9a7);
    const glazing = matte(0x3f504a);
    const top = 1.62;
    box(paving, buildingW, 0.16, buildingD, 0, grade + 0.08, 0, volume);
    box(facade, buildingW - 0.23, 1.28, buildingD - 0.25, 0, grade + 0.77, 0, volume).castShadow = true;
    box(ivory, buildingW - 0.07, 0.23, buildingD - 0.07, 0, grade + top - 0.115, 0, volume).castShadow = true;
    box(paving, buildingW - 0.42, 0.04, buildingD - 0.45, 0, grade + top + 0.02, 0, volume);
    box(ivory, (buildingW - 0.7) * 0.47, 0.04, buildingD - 0.62, -buildingW * 0.2, grade + top + 0.045, 0, volume);
    box(glazing, buildingW - 0.58, 0.91, 0.037, 0, grade + 0.71, buildingD / 2 - 0.117, volume);
    for (const x of [-0.31, -0.11, 0.11, 0.31]) {
      box(facade, 0.045, 0.91, 0.052, x * (buildingW - 0.25), grade + 0.71, buildingD / 2 - 0.117, volume);
    }
    box(glazing, 0.035, 0.65, buildingD * 0.59, buildingW / 2 - 0.109, grade + 0.82, -0.15, volume);
    for (let z = 2; z < halfD - 0.2; z += 0.47) box(ivory, 0.72, 0.04, 0.37, 0, grade + 0.02, z, volume);

    /** @param {string} label @param {number} width @param {number} x @param {number} z */
    function marking(label, width, x, z) {
      const sprite = plaque(label, width);
      materials.add(sprite.material);
      textures.add(sprite.material.map);
      sprite.position.set(x, 1.51, z);
      sprite.renderOrder = 5;
      scene.add(sprite);
      box(dark, 0.04, 0.92, 0.04, x, 0.96, z);
      return sprite;
    }
    const northX = -halfW - 0.93;
    const northZ = -halfD + 0.86;
    const north = marking("NORTE", 370, northX, northZ);
    const street = marking("CALLE · FRENTE", 512, w * 0.12, halfD + 2.42);
    const arrow = new THREE.Shape();
    arrow.moveTo(-0.06, 0).lineTo(0.06, 0).lineTo(0.06, 0.79).lineTo(0.26, 0.79)
      .lineTo(0, 1.25).lineTo(-0.26, 0.79).lineTo(-0.06, 0.79).closePath();
    const northArrow = mesh(new THREE.ShapeGeometry(arrow), dark);
    northArrow.rotation.x = -Math.PI / 2;
    northArrow.position.set(northX, 0.539, northZ);

    const solar = new THREE.Group();
    scene.add(solar);
    const orb = mesh(new THREE.SphereGeometry(0.31, 20, 12), track(new THREE.MeshBasicMaterial({ color: 0xe7a84f, toneMapped: false })), solar);
    const ring = mesh(new THREE.TorusGeometry(0.46, 0.022, 8, 32), track(new THREE.MeshBasicMaterial({ color: 0xb97b34, toneMapped: false })), solar);
    const accent = track(new THREE.MeshBasicMaterial({ color: brass, toneMapped: false }));
    const bearing = mesh(new THREE.PlaneGeometry(0.045, 1), accent, solar);
    bearing.rotation.order = "YXZ";
    bearing.rotation.x = -Math.PI / 2;
    const stem = mesh(new THREE.CylinderGeometry(0.016, 0.016, 1, 6), accent, solar);
    const pin = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 18), accent, solar);
    /** @type {SunSample | null | undefined} */
    let lastSample;

    /** @param {SunSample | null} sample */
    function applySun(sample) {
      if (lastSample === sample) return;
      lastSample = sample;
      scene.background = sample ? dayBackground : nightBackground;
      solar.visible = light.visible = !!sample;
      fill.intensity = sample ? 1.9 : 1.08;
      if (!sample) return;
      // La misma distancia orientativa de sombra de la planta, reescalada al fondo de la maqueta.
      const slope = top / (sample.shadow * d / 224);
      light.position.set(sample.x * 22, slope * 22, sample.y * 22);
      const radius = Math.min(7.1, 4.9 / slope);
      const x = sample.x * radius;
      const z = sample.y * radius;
      const altitude = Math.max(0.42, slope * radius);
      orb.position.set(x, grade + altitude, z);
      ring.position.copy(orb.position);
      pin.position.set(x, grade + 0.061, z);
      stem.position.set(x, grade + altitude / 2, z);
      stem.scale.y = altitude;
      bearing.position.set(x / 2, grade + 0.061, z / 2);
      bearing.rotation.y = Math.atan2(x, z);
      bearing.scale.y = radius;
    }

    let pixelWidth = 0;
    let pixelHeight = 0;
    return {
      /** @param {number} width @param {number} height */
      resize(width, height) {
        if (width === pixelWidth && height === pixelHeight) return;
        pixelWidth = width;
        pixelHeight = height;
        webgl.setSize(width, height, false);
        const aspect = width / height;
        const span = Math.max(18.1, 21.8 / aspect);
        camera.left = -span * aspect / 2;
        camera.right = -camera.left;
        camera.top = span / 2;
        camera.bottom = -camera.top;
      },
      /** @param {number} azimuth @param {number} tilt */
      orbit(azimuth, tilt) {
        view.azimuth += azimuth;
        view.tilt = THREE.MathUtils.clamp(view.tilt + tilt, 0.41, 1.22);
      },
      /** @param {number} factor */
      zoomBy(factor) { view.zoom = THREE.MathUtils.clamp(view.zoom * factor, 0.75, 1.58); },
      resetCamera() { Object.assign(view, initial); },
      /** @param {SunSample | null} sample @param {boolean} showFootprint */
      render(sample, showFootprint) {
        applySun(sample);
        volume.visible = showFootprint;
        const ground = 27 * Math.cos(view.tilt);
        camera.position.set(ground * Math.sin(view.azimuth), 27 * Math.sin(view.tilt), ground * Math.cos(view.azimuth));
        camera.position.add(target);
        camera.lookAt(target);
        camera.zoom = view.zoom;
        camera.updateProjectionMatrix();
        ring.quaternion.copy(camera.quaternion);
        const labelUnit = (camera.top - camera.bottom) / (pixelHeight * view.zoom);
        const labelScale = (pixelWidth < 390 ? 100 : 116) * labelUnit / 512;
        for (const label of [street, north]) {
          label.scale.set(label.material.map.image.width * labelScale, 146 * labelScale, 1);
        }
        webgl.render(scene, camera);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
