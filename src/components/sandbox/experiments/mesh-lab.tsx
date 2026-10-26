"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Cube,
  Eye,
  ArrowsClockwise,
  Play,
  Pause,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type GeometryShape = "torusKnot" | "icosahedron" | "dodecahedron" | "octahedron";
type RenderStyle = "shaded" | "wireframe" | "points";

const SHAPES: { id: GeometryShape; label: string }[] = [
  { id: "torusKnot", label: "Torus Knot" },
  { id: "icosahedron", label: "Icosahedron" },
  { id: "dodecahedron", label: "Dodecahedron" },
  { id: "octahedron", label: "Octahedron" },
];

const STYLES: { id: RenderStyle; label: string }[] = [
  { id: "shaded", label: "Shaded" },
  { id: "wireframe", label: "Wireframe" },
  { id: "points", label: "Points" },
];

function createGeometry(shape: GeometryShape): THREE.BufferGeometry {
  switch (shape) {
    case "torusKnot":
      return new THREE.TorusKnotGeometry(1.2, 0.38, 128, 32);
    case "icosahedron":
      return new THREE.IcosahedronGeometry(1.6, 2);
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(1.6, 1);
    case "octahedron":
      return new THREE.OctahedronGeometry(1.7, 2);
  }
}

export function MeshLabExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [shape, setShape] = useState<GeometryShape>("torusKnot");
  const [style, setStyle] = useState<RenderStyle>("shaded");
  const [wireframeOverlay, setWireframeOverlay] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [particleCount, setParticleCount] = useState(0);

  // References for mutable animation loop state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mainObjectRef = useRef<THREE.Object3D | null>(null);
  const wireframeObjectRef = useRef<THREE.LineSegments | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Pointer drag state
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.3, y: 0.3 });
  const currentRotationRef = useRef({ x: 0.3, y: 0.3 });

  // Update object when shape or style changes
  const updateMesh = useCallback(
    (targetShape: GeometryShape, targetStyle: RenderStyle, showOverlay: boolean) => {
      const scene = sceneRef.current;
      if (!scene) return;

      // Clean up previous objects
      if (mainObjectRef.current) {
        scene.remove(mainObjectRef.current);
        if (mainObjectRef.current instanceof THREE.Mesh || mainObjectRef.current instanceof THREE.Points) {
          mainObjectRef.current.geometry.dispose();
          if (Array.isArray(mainObjectRef.current.material)) {
            mainObjectRef.current.material.forEach((m) => m.dispose());
          } else {
            mainObjectRef.current.material.dispose();
          }
        }
        mainObjectRef.current = null;
      }

      if (wireframeObjectRef.current) {
        scene.remove(wireframeObjectRef.current);
        wireframeObjectRef.current.geometry.dispose();
        if (Array.isArray(wireframeObjectRef.current.material)) {
          wireframeObjectRef.current.material.forEach((m) => m.dispose());
        } else {
          wireframeObjectRef.current.material.dispose();
        }
        wireframeObjectRef.current = null;
      }

      const geometry = createGeometry(targetShape);
      const isDark = document.documentElement.classList.contains("dark");
      const accentColor = isDark ? 0xff6a3d : 0xe64301;
      const inkColor = isDark ? 0xf5ede6 : 0x1a0a06;

      if (targetStyle === "shaded") {
        const material = new THREE.MeshStandardMaterial({
          color: accentColor,
          metalness: 0.65,
          roughness: 0.28,
          flatShading: targetShape !== "torusKnot",
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        mainObjectRef.current = mesh;

        // Optional wireframe edge overlay
        if (showOverlay) {
          const wireGeometry = new THREE.WireframeGeometry(geometry);
          const wireMaterial = new THREE.LineBasicMaterial({
            color: inkColor,
            transparent: true,
            opacity: isDark ? 0.25 : 0.18,
          });
          const wireMesh = new THREE.LineSegments(wireGeometry, wireMaterial);
          scene.add(wireMesh);
          wireframeObjectRef.current = wireMesh;
        }
      } else if (targetStyle === "wireframe") {
        const wireGeometry = new THREE.WireframeGeometry(geometry);
        const wireMaterial = new THREE.LineBasicMaterial({
          color: accentColor,
          linewidth: 1.5,
        });
        const wireMesh = new THREE.LineSegments(wireGeometry, wireMaterial);
        scene.add(wireMesh);
        mainObjectRef.current = wireMesh;
      } else {
        // Points / constellation style
        const pointsMaterial = new THREE.PointsMaterial({
          color: accentColor,
          size: 0.06,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geometry, pointsMaterial);
        scene.add(points);
        mainObjectRef.current = points;
      }

      setParticleCount(geometry.attributes.position?.count ?? 0);
    },
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = Math.max(340, Math.min(width * 0.65, 480));

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    // Update the drawing buffer only. CSS controls the display size, so
    // three.js must not write inline canvas styles.
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff6a3d, 2.2);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight2.position.set(-4, -3, -2);
    scene.add(dirLight2);

    // Initial mesh creation
    updateMesh(shape, style, wireframeOverlay);

    // Animation Loop
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Auto rotation when enabled and not dragging
      if (isRotating && !isDraggingRef.current && !prefersReduced) {
        targetRotationRef.current.y += delta * 0.7 * rotationSpeed;
        targetRotationRef.current.x += delta * 0.35 * rotationSpeed;
      }

      // Smooth damping toward target rotation
      currentRotationRef.current.x +=
        (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

      const rotX = currentRotationRef.current.x;
      const rotY = currentRotationRef.current.y;

      if (mainObjectRef.current) {
        mainObjectRef.current.rotation.x = rotX;
        mainObjectRef.current.rotation.y = rotY;
      }
      if (wireframeObjectRef.current) {
        wireframeObjectRef.current.rotation.x = rotX;
        wireframeObjectRef.current.rotation.y = rotY;
      }

      renderer.render(scene, camera);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Resize observer. It updates the drawing buffer only. It never writes
    // canvas styles, so it cannot resize the observed container and start a
    // resize loop.
    let lastWidth = width;
    let lastHeight = height;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const newWidth = entry.contentRect.width;
      const newHeight = Math.max(340, Math.min(newWidth * 0.65, 480));
      if (newWidth === lastWidth && newHeight === lastHeight) return;
      lastWidth = newWidth;
      lastHeight = newHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight, false);
    });

    resizeObserver.observe(container);

    // Theme observer: sync material colors when theme toggles
    const themeObserver = new MutationObserver(() => {
      updateMesh(shape, style, wireframeOverlay);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      themeObserver.disconnect();

      if (mainObjectRef.current) {
        scene.remove(mainObjectRef.current);
      }
      if (wireframeObjectRef.current) {
        scene.remove(wireframeObjectRef.current);
      }
      renderer.dispose();
    };
  }, [shape, style, wireframeOverlay, isRotating, rotationSpeed, prefersReduced, updateMesh]);

  // Pointer event handlers for direct 3D manipulation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousPointerRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousPointerRef.current.x;
    const deltaY = e.clientY - previousPointerRef.current.y;
    previousPointerRef.current = { x: e.clientX, y: e.clientY };

    targetRotationRef.current.y += deltaX * 0.01;
    targetRotationRef.current.x += deltaY * 0.01;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer might already be released
    }
  };

  const handleResetOrientation = () => {
    targetRotationRef.current = { x: 0.3, y: 0.3 };
  };

  return (
    <div className="border border-ink/10 bg-panel/30">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 bg-cream">
        <div className="flex items-center gap-2">
          <Cube size={16} weight="duotone" className="text-accent" />
          <p className="font-mono text-body-xs uppercase tracking-wide text-ink/70">
            WebGL / Three.js Mesh Playground
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-ink/50 tabular-nums">
            {particleCount} vertices
          </span>
          <button
            type="button"
            onClick={handleResetOrientation}
            className="inline-flex items-center gap-1 border border-ink/15 px-2 py-0.5 font-mono text-[11px] text-ink/60 transition-colors hover:border-ink/40 hover:text-ink"
            title="Reset rotation angles"
          >
            <ArrowsClockwise size={12} />
            Reset
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex aspect-[20/13] max-h-[480px] min-h-[340px] w-full items-center justify-center overflow-hidden bg-cream select-none cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="block h-full w-full touch-none"
        />

        {/* Ambient watermark prompt */}
        <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-wider text-ink/40">
          Drag to tumble in 3D &bull; Real-time shaders
        </div>

        {/* Rotation indicator badge */}
        <div className="pointer-events-none absolute top-3 right-4 flex items-center gap-1.5 font-mono text-[10px] text-ink/50 bg-cream/80 backdrop-blur px-2 py-1 border border-ink/10">
          <Sparkle size={12} weight="fill" className="text-accent" />
          <span>60 FPS WebGL</span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid gap-4 border-t border-ink/10 p-4 bg-cream sm:grid-cols-2 lg:grid-cols-4">
        {/* Geometry Selector */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
            Geometry
          </span>
          <div className="grid grid-cols-2 gap-1">
            {SHAPES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setShape(item.id)}
                className={`px-2 py-1.5 text-left font-mono text-body-xs transition-colors ${
                  shape === item.id
                    ? "bg-accent font-medium text-cream"
                    : "border border-ink/10 text-ink/70 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shading Style */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
            Render Mode
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              {STYLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStyle(item.id)}
                  className={`flex-1 py-1.5 text-center font-mono text-body-xs transition-colors ${
                    style === item.id
                      ? "bg-ink font-medium text-cream"
                      : "border border-ink/10 text-ink/70 hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {style === "shaded" && (
              <button
                type="button"
                onClick={() => setWireframeOverlay(!wireframeOverlay)}
                className={`mt-1 flex items-center justify-between border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  wireframeOverlay
                    ? "border-accent/40 bg-accent/5 text-accent"
                    : "border-ink/10 text-ink/60 hover:text-ink"
                }`}
              >
                <span>Edge overlay</span>
                <Eye size={13} weight={wireframeOverlay ? "fill" : "regular"} />
              </button>
            )}
          </div>
        </div>

        {/* Motion & Speed */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
            Spin Speed
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className={`flex h-8 w-8 items-center justify-center border transition-colors ${
                isRotating
                  ? "border-accent bg-accent text-cream"
                  : "border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink"
              }`}
              title={isRotating ? "Pause animation" : "Start spin"}
            >
              {isRotating ? (
                <Pause size={13} weight="fill" />
              ) : (
                <Play size={13} weight="fill" />
              )}
            </button>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              disabled={!isRotating}
              aria-label="Rotation speed"
              className="w-full accent-accent disabled:opacity-30"
            />
            <span className="w-8 font-mono text-body-xs text-ink/60 tabular-nums">
              {rotationSpeed}x
            </span>
          </div>
        </div>

        {/* Specs & Tech Info */}
        <div className="flex flex-col gap-1.5 border-t border-ink/10 pt-3 sm:border-t-0 sm:pt-0">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
            Stack
          </span>
          <div className="flex flex-wrap gap-1">
            {["Three.js", "WebGL", "Directional Lights", "OKLCH"].map((tag) => (
              <span
                key={tag}
                className="border border-ink/10 bg-panel px-2 py-0.5 font-mono text-[10px] text-ink/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
