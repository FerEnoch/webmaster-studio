import { useEffect, useRef } from "react";

// Both materials share the light's path, so the dust belongs to the vein.
const lightPath = /* glsl */ `
  vec2 lightCenter(float progress) {
    return vec2(0.12 + progress * 0.76, 0.70 - progress * 0.24);
  }
`;

export default function FondoScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let release: (() => void) | undefined;

    async function mount() {
      // This pinned three release ships JS only. Keep the exception at the
      // lazy boundary rather than adding a second dependency for decoration.
      // @ts-expect-error three@0.187.0 has no bundled type declarations.
      const THREE = await import("three");
      if (disposed) return;

      // No WebGL is a supported fallback: the DOM and copper CSS remain intact.
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      } catch {
        return;
      }
      renderer.setClearColor(0x0a0c10, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 30);
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const count = 350; // Resize selects the mobile draw range without reallocating.
      const positions = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = Math.random();
        positions[i * 3 + 1] = Math.random();
        positions[i * 3 + 2] = Math.random();
        seeds[i] = Math.random();
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      const uniforms = {
        uProgress: { value: 0 },
        uBreathe: { value: 0.8 },
        uTime: { value: 0 },
        uWind: { value: 0 },
        uAspect: { value: 1 },
        uDpr: { value: 1 },
        uCopper: { value: new THREE.Color("#D89646") },
      };
      const dustMaterial = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uProgress;
          uniform float uBreathe;
          uniform float uTime;
          uniform float uWind;
          uniform float uAspect;
          uniform float uDpr;
          attribute float aSeed;
          varying float vGlow;
          ${lightPath}
          void main() {
            vec2 uv = fract(position.xy + vec2(
              uWind * (0.25 + aSeed * 0.75) + uProgress * 0.12,
              -uTime * (0.004 + aSeed * 0.006)
            ));
            // A light pull gathers the motes around the travelling halo.
            float nearLight = max(0.0, 1.0 - abs(uv.x - lightCenter(uProgress).x) / 0.4);
            uv.x = mix(uv.x, lightCenter(uProgress).x, nearLight * 0.12);
            vec3 point = vec3((uv - 0.5) * vec2(uAspect, 1.0) * 4.8, (position.z - 0.5) * 1.5);
            vec4 view = modelViewMatrix * vec4(point, 1.0);
            gl_Position = projectionMatrix * view;
            vec2 screenUv = gl_Position.xy / gl_Position.w * 0.5 + 0.5;
            float proximity = max(0.0, 1.0 - abs(screenUv.x - lightCenter(uProgress).x) / 0.4);
            float twinkle = 0.75 + 0.25 * sin(uTime * 1.4 + aSeed * 6.28318);
            vGlow = (0.18 + 0.82 * proximity) * uBreathe * twinkle;
            gl_PointSize = (1.2 + aSeed * 2.2) * (1.0 + proximity * 0.6) * uDpr * (6.0 / -view.z);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uCopper;
          varying float vGlow;
          void main() {
            float radius = length(gl_PointCoord - 0.5) * 2.0;
            float alpha = (1.0 - smoothstep(0.0, 1.0, radius)) * vGlow;
            gl_FragColor = vec4(uCopper, alpha);
          }
        `,
      });
      const dust = new THREE.Points(geometry, dustMaterial);
      // Positions are normalized seeds, not the shader's actual bounds.
      dust.frustumCulled = false;
      dust.renderOrder = 1;
      scene.add(dust);

      const lightGeometry = new THREE.PlaneGeometry(2, 2);
      const lightMaterial = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uProgress;
          uniform float uBreathe;
          uniform float uAspect;
          uniform vec3 uCopper;
          varying vec2 vUv;
          ${lightPath}
          void main() {
            vec2 center = lightCenter(uProgress);
            vec2 delta = (vUv - center) * vec2(uAspect, 1.0);
            float halo = exp(-dot(delta, delta) * 5.5);
            float band = exp(-pow((vUv.y - center.y) / 0.045, 2.0));
            float strength = (halo * 0.26 + band * 0.15) * uBreathe;
            gl_FragColor = vec4(mix(uCopper, vec3(1.0, 0.86, 0.67), band * 0.55), strength);
          }
        `,
      });
      const light = new THREE.Mesh(lightGeometry, lightMaterial);
      light.frustumCulled = false;
      scene.add(light);

      let raf = 0;
      let previousTime = 0;
      let progress = 0;
      let target = 0;
      const updateTarget = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      };
      const paint = () => {
        uniforms.uProgress.value = progress;
        // One slow breath across the scroll, not another autoplay effect.
        uniforms.uBreathe.value = 0.65 + 0.25 * Math.sin(progress * Math.PI);
        camera.position.z = 6 - progress * 0.45;
        renderer.render(scene, camera);
      };
      const frame = (now: number) => {
        raf = 0;
        if (disposed || document.hidden || motion.matches) return;
        const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 0;
        previousTime = now;
        progress += (target - progress) * (1 - Math.exp(-delta * 6));
        uniforms.uTime.value += delta;
        uniforms.uWind.value += delta * (0.012 + progress * 0.08);
        paint();
        raf = window.requestAnimationFrame(frame);
      };
      const stop = () => {
        window.cancelAnimationFrame(raf);
        raf = 0;
        previousTime = 0;
      };
      const resume = () => {
        stop();
        if (disposed || document.hidden) return;
        if (motion.matches) {
          progress = 0.35;
          uniforms.uTime.value = 0;
          uniforms.uWind.value = 0;
          paint(); // Exactly one static frame; no rAF or scroll painting.
        } else {
          updateTarget();
          raf = window.requestAnimationFrame(frame);
        }
      };
      const resize = () => {
        if (document.hidden) return;
        const width = Math.max(1, window.innerWidth);
        const height = Math.max(1, window.innerHeight);
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        uniforms.uAspect.value = camera.aspect;
        uniforms.uDpr.value = dpr;
        geometry.setDrawRange(0, width < 700 ? 140 : count);
        updateTarget();
        resume();
      };
      const onVisibility = () => {
        if (document.hidden) stop();
        else resize();
      };
      const onScroll = () => {
        if (!document.hidden && !motion.matches) updateTarget();
      };
      const cleanup = () => {
        stop();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        document.removeEventListener("astro:before-swap", cleanup);
        motion.removeEventListener("change", resume);
        geometry.dispose();
        dustMaterial.dispose();
        lightGeometry.dispose();
        lightMaterial.dispose();
        renderer.dispose();
        release = undefined;
        disposed = true;
      };
      release = cleanup;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibility);
      document.addEventListener("astro:before-swap", cleanup, { once: true });
      motion.addEventListener("change", resume);
      resize();
    }

    void mount().catch(() => {
      // A failed lazy load must never prevent reading or booking.
      release?.();
    });
    return () => {
      disposed = true;
      release?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-gg-background
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}
