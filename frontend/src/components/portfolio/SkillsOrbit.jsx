import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { skills } from '../../data/mock';

/**
 * Skills orbit — vanilla Three.js (no R3F), so it works with React 19.
 * Scene: rotating ring of spheres with HTML labels via CSS2DRenderer.
 */
const SkillsOrbit = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111126);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0x5b4fd8, 0.5, 100);
    pointLight2.position.set(-4, -2, 2);
    scene.add(pointLight2);

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const radius = 2.2;
    const count = skills.length;
    const geometry = new THREE.SphereGeometry(0.12, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xe8a020 });

    skills.forEach((skill, i) => {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(x, 0, z);
      orbitGroup.add(mesh);

      const labelEl = document.createElement('div');
      labelEl.className = 'skills-orbit-label';
      labelEl.textContent = skill.name;
      labelEl.style.cssText = [
        'font-family: "Space Mono", monospace;',
        'font-size: 10px;',
        'color: #F2EFE8;',
        'white-space: nowrap;',
        'letter-spacing: 0.06em;',
        'opacity: 0.9;',
      ].join(' ');
      const label = new CSS2DObject(labelEl);
      label.position.set(x, 0.35, z);
      orbitGroup.add(label);
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!prefersReducedMotion) orbitGroup.rotation.y += 0.003;
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      orbitGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      if (labelRenderer.domElement.parentNode) labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
    };
  }, []);

  return (
    <section id="skills-orbit" className="py-12 md:py-20 border-b border-[var(--border)]">
      <div className="max-w-[1160px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-px bg-[var(--stardust)]" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
            03 — Skills
          </span>
        </div>
        <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
          Skills orbit
        </h2>
        <p className="font-body text-[15px] leading-[1.7] mb-8 max-w-[520px] text-[var(--muted)]">
          Core technologies and tools — Three.js orbit visualization.
        </p>
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-none border border-[var(--border)] bg-[var(--surface)] h-[260px] md:h-[320px]"
        />
      </div>
    </section>
  );
};

export default SkillsOrbit;
