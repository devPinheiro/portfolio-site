import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";

function makeImage(seed: number, hue: number) {
  const h2 = (hue + 22) % 360;
  const h3 = (hue + 58) % 360;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1400" viewBox="0 0 1024 1400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue} 84% 60%)" />
        <stop offset="62%" stop-color="hsl(${h2} 76% 46%)" />
        <stop offset="100%" stop-color="hsl(${h3} 72% 30%)" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1400" fill="url(#g)" />
    <circle cx="${220 + (seed % 4) * 180}" cy="${290 + (seed % 5) * 120}" r="230" fill="rgba(255,255,255,0.15)" />
    <circle cx="${840 - (seed % 5) * 100}" cy="${980 - (seed % 4) * 120}" r="280" fill="rgba(255,255,255,0.10)" />
    <text x="76" y="1310" font-size="72" fill="rgba(255,255,255,0.68)" font-family="ui-sans-serif, system-ui">FRAME ${seed
      .toString()
      .padStart(2, "0")}</text>
  </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const IMAGE_COUNT = 8;

function randomPicsumUrls(count: number): string[] {
  return Array.from({ length: count }, () => {
    const seed =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/720/960`;
  });
}

type PlaneEntry = {
  mesh: Mesh;
  program: Program;
};

function wrap(value: number, min: number, max: number) {
  const range = max - min;
  if (range <= 0) return min;
  let v = value - min;
  v = ((v % range) + range) % range;
  return v + min;
}

type AnimationMode = "carousel" | "orbit" | "wave" | "reel";

const TWO_PI = Math.PI * 2;

export function WebglSneezeMasonryDemo() {
  const reduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRef = useRef(1);
  const lastGapRef = useRef(1.5);
  const targetRef = useRef(0);
  const animationModeRef = useRef<AnimationMode>("carousel");
  const [hasWebglError, setHasWebglError] = useState(false);
  const [imageRevision, setImageRevision] = useState(0);
  const [animationMode, setAnimationMode] = useState<AnimationMode>("carousel");

  useEffect(() => {
    animationModeRef.current = animationMode;
    stepRef.current =
      animationMode === "reel"
        ? TWO_PI / IMAGE_COUNT
        : lastGapRef.current;
  }, [animationMode]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.25),
        webgl: 2,
      });
    } catch (error) {
      console.error("WebGL gallery init failed:", error);
      queueMicrotask(() => setHasWebglError(true));
      return;
    }
    const gl = renderer.gl;
    if (!gl) {
      queueMicrotask(() => setHasWebglError(true));
      return;
    }
    if (typeof renderer.bindVertexArray !== "function") {
      console.error(
        "WebGL gallery requires vertex array support (WebGL2 or OES_vertex_array_object).",
      );
      queueMicrotask(() => setHasWebglError(true));
      return;
    }
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 38 });
    camera.position.z = 7;
    const scene = new Transform();
    const geometry = new Plane(gl, { widthSegments: 8, heightSegments: 10 });

    const vertex = renderer.isWebgl2
      ? `#version 300 es
      precision highp float;
      in vec3 position;
      in vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uStrength;
      out vec2 vUv;
      void main() {
        vec3 p = position;
        p.z += sin((uv.y * 3.1415926)) * uStrength * 0.12;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        vUv = uv;
      }
    `
      : `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uStrength;
      varying vec2 vUv;
      void main() {
        vec3 p = position;
        p.z += sin((uv.y * 3.1415926)) * uStrength * 0.12;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        vUv = uv;
      }
    `;

    const fragment = renderer.isWebgl2
      ? `#version 300 es
      precision highp float;
      uniform sampler2D tMap;
      uniform float uStrength;
      uniform float uAlpha;
      in vec2 vUv;
      out vec4 FragColor;
      void main() {
        vec2 offset = vec2((vUv.y - 0.5) * 0.06 * uStrength, 0.0);
        vec3 tex;
        tex.r = texture(tMap, vUv + offset).r;
        tex.g = texture(tMap, vUv).g;
        tex.b = texture(tMap, vUv - offset).b;
        float vignette = 1.0 - smoothstep(0.18, 1.15, distance(vUv, vec2(0.5)));
        FragColor = vec4(tex * vignette, uAlpha);
      }
    `
      : `
      precision highp float;
      uniform sampler2D tMap;
      uniform float uStrength;
      uniform float uAlpha;
      varying vec2 vUv;
      void main() {
        vec2 offset = vec2((vUv.y - 0.5) * 0.06 * uStrength, 0.0);
        vec3 tex;
        tex.r = texture2D(tMap, vUv + offset).r;
        tex.g = texture2D(tMap, vUv).g;
        tex.b = texture2D(tMap, vUv - offset).b;
        float vignette = 1.0 - smoothstep(0.18, 1.15, distance(vUv, vec2(0.5)));
        gl_FragColor = vec4(tex * vignette, uAlpha);
      }
    `;

    const imageUrls = randomPicsumUrls(IMAGE_COUNT);

    const entries: PlaneEntry[] = imageUrls.map((src, i) => {
      const texture = new Texture(gl);
      const image = new Image();
      image.decoding = "async";
      image.crossOrigin = "anonymous";
      image.referrerPolicy = "no-referrer";
      image.src = src;
      image.onload = () => {
        texture.image = image;
      };
      image.onerror = () => {
        const fallback = new Image();
        fallback.src = makeImage(i + 1, 128 + i * 16);
        fallback.onload = () => {
          texture.image = fallback;
        };
      };
      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        uniforms: {
          tMap: { value: texture },
          uStrength: { value: 0 },
          uAlpha: { value: 1 },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
      mesh.position.x = i * 2;
      return { mesh, program };
    });

    let current = 0;
    let prev = 0;
    let velocity = 0;
    let gap = 1.5;
    let total = gap * entries.length;
    let width = 2.25;
    let height = 3.1;
    let raf = 0;
    let drag = false;
    let lastX = 0;
    let frame = 0;

    const resize = () => {
      const w = Math.max(320, host.clientWidth);
      const h = Math.max(360, host.clientHeight);
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
      const fov = (camera.fov * Math.PI) / 180;
      const viewH = 2 * Math.tan(fov / 2) * camera.position.z;
      const viewW = viewH * (w / h);
      width = Math.min(2.35, viewW * 0.24);
      height = width * 1.38;
      gap = width * 1.16;
      total = gap * entries.length;
      lastGapRef.current = gap;
      stepRef.current =
        animationModeRef.current === "reel"
          ? TWO_PI / entries.length
          : gap;
    };

    const render = () => {
      frame += 1;
      const mode = animationModeRef.current;
      const needsContinuousFrames =
        mode === "orbit" ||
        (mode === "wave" && !reduceMotion) ||
        (mode === "reel" && !reduceMotion);

      current += (targetRef.current - current) * 0.085;
      prev += (current - prev) * 0.78;
      velocity = current - prev;
      const isMoving =
        needsContinuousFrames ||
        drag ||
        Math.abs(targetRef.current - current) > 0.00015 ||
        Math.abs(velocity) > 0.00015;
      if (!isMoving && frame % 2 === 0) {
        raf = requestAnimationFrame(render);
        return;
      }

      const half = total * 0.5;
      const t = performance.now() * 0.001;

      if (mode === "orbit") {
        scene.rotation.y = t * 0.12;
        scene.rotation.x = Math.sin(t * 0.25) * 0.04;
      } else if (mode === "reel" && !reduceMotion) {
        scene.rotation.y = Math.sin(t * 0.35) * 0.06;
        scene.rotation.x = 0;
      } else {
        scene.rotation.y = 0;
        scene.rotation.x = 0;
      }

      if (mode === "reel") {
        const n = entries.length;
        const angleStep = TWO_PI / n;
        const halfChord = Math.sin(angleStep * 0.5);
        const R = Math.max(
          2.1,
          Math.min(3.45, (width * 0.62) / Math.max(0.06, halfChord)),
        );
        const maxCardW = R * angleStep * 0.88;
        const reelW = Math.min(width, Math.max(0.75, maxCardW));
        const reelH = reelW * 1.38;

        for (let i = 0; i < n; i++) {
          const entry = entries[i];
          const theta = i * angleStep + current;
          const x = Math.sin(theta) * R;
          const z = Math.cos(theta) * R;
          const facing = Math.cos(theta);
          entry.mesh.position.x = x;
          entry.mesh.position.y =
            Math.sin(theta * 2 + t) * (reduceMotion ? 0 : 0.06);
          entry.mesh.position.z = z;
          entry.mesh.scale.set(reelW, reelH, 1);
          entry.mesh.rotation.y = theta + velocity * 4.2;
          entry.mesh.rotation.z = -velocity * 2.8;
          entry.mesh.rotation.x = velocity * 1.4;
          entry.program.uniforms.uStrength.value = reduceMotion
            ? 0
            : Math.min(1, Math.abs(velocity) * 22);
          const front = (facing + 1) * 0.5;
          entry.program.uniforms.uAlpha.value = Math.max(
            0.24,
            0.32 + front * 0.66,
          );
        }
      } else {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const baseX = i * gap + current;
          const x = wrap(baseX, -half, half);
          const depth = Math.abs(x) / half;
          entry.mesh.position.x = x;
          let y = Math.sin(x * 0.62) * 0.14;
          if (mode === "wave" && !reduceMotion) {
            y += Math.sin(t * 1.4 + i * 0.65) * 0.1;
          }
          entry.mesh.position.y = y;
          entry.mesh.position.z = -depth * 1.4;
          entry.mesh.scale.set(width, height, 1);
          entry.mesh.rotation.y = -x * 0.24 + velocity * 5.8;
          entry.mesh.rotation.z = -velocity * 2.2;
          entry.mesh.rotation.x = 0;
          entry.program.uniforms.uStrength.value = reduceMotion
            ? 0
            : Math.min(1, Math.abs(velocity) * 18);
          entry.program.uniforms.uAlpha.value = Math.max(0.28, 1 - depth * 0.62);
        }
      }

      renderer.render({ scene, camera });
      raf = requestAnimationFrame(render);
    };

    const onWheel = (e: WheelEvent) => {
      const spin =
        animationModeRef.current === "reel"
          ? e.deltaY * 0.0033
          : e.deltaY * 0.0022;
      targetRef.current -= spin;
    };
    const onPointerDown = (e: PointerEvent) => {
      drag = true;
      lastX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const dragMul =
        animationModeRef.current === "reel" ? 0.022 : 0.015;
      targetRef.current += dx * dragMul;
    };
    const onPointerUp = () => {
      drag = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    raf = requestAnimationFrame(render);
    host.addEventListener("wheel", onWheel, { passive: true });
    host.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("wheel", onWheel);
      host.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      geometry.remove();
      entries.forEach(({ mesh, program }) => {
        mesh.setParent(null);
        program.remove();
      });
    };
  }, [reduceMotion, imageRevision]);

  return (
    <section aria-label="Kinetic WebGL image gallery interactive demo">
      <p className="mb-6 max-w-3xl text-sm text-black/65 dark:text-white/65">
        Drag or scroll the strip; distortion ramps with speed. Use{" "}
        <span className="font-medium text-black/80 dark:text-white/80">
          New images
        </span>{" "}
        for another random Picsum set, and mode chips for carousel,{" "}
        <span className="font-medium text-black/80 dark:text-white/80">
          3D reel
        </span>
        , orbit, or wave.{" "}
        <Link
          to="/demos"
          className="underline underline-offset-4 hover:opacity-80"
        >
          Back to demos
        </Link>
      </p>

      <div
        ref={hostRef}
        className="relative h-[62vh] min-h-[420px] overflow-hidden rounded-2xl border border-black/12 bg-linear-to-b from-zinc-100 to-zinc-200 dark:border-white/15 dark:from-zinc-900 dark:to-black"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
        />
        {hasWebglError ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
            <p className="max-w-md rounded-lg border border-black/12 bg-white/85 px-4 py-3 text-sm text-black/80 backdrop-blur dark:border-white/15 dark:bg-black/70 dark:text-white/80">
              WebGL could not be initialized in this browser/device. Try a
              different browser or enable hardware acceleration.
            </p>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white/55 to-transparent dark:from-black/55" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white/70 to-transparent dark:from-black/75" />

        <div className="absolute bottom-4 left-4 z-20 flex max-w-[min(100%,18rem)] flex-col gap-2">
          <div className="rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-xs text-black/70 backdrop-blur dark:border-white/15 dark:bg-black/70 dark:text-white/70">
            Drag horizontally or use mouse wheel
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: "carousel" as const, label: "Carousel" },
                { id: "reel" as const, label: "3D reel" },
                { id: "orbit" as const, label: "Orbit" },
                { id: "wave" as const, label: "Wave" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAnimationMode(id)}
                className={`rounded-md border px-2 py-1 text-[11px] font-medium backdrop-blur transition-colors ${
                  animationMode === id
                    ? "border-black/25 bg-black/10 text-black dark:border-white/30 dark:bg-white/15 dark:text-white"
                    : "border-black/12 bg-white/70 text-black/75 hover:bg-white dark:border-white/15 dark:bg-black/60 dark:text-white/75 dark:hover:bg-black/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setImageRevision((n) => n + 1)}
            className="rounded-lg border border-black/15 bg-white/75 px-3 py-1.5 text-xs font-medium text-black hover:bg-white dark:border-white/20 dark:bg-black/70 dark:text-white dark:hover:bg-black/90"
          >
            New images
          </button>
          <button
            type="button"
            onClick={() => {
              targetRef.current += stepRef.current;
            }}
            className="rounded-lg border border-black/15 bg-white/75 px-3 py-1.5 text-xs font-medium text-black hover:bg-white dark:border-white/20 dark:bg-black/70 dark:text-white dark:hover:bg-black/90"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => {
              targetRef.current -= stepRef.current;
            }}
            className="rounded-lg border border-black/15 bg-white/75 px-3 py-1.5 text-xs font-medium text-black hover:bg-white dark:border-white/20 dark:bg-black/70 dark:text-white dark:hover:bg-black/90"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
