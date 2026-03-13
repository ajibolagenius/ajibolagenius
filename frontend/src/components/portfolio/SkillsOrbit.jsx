import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { skills } from '../../data/mock';

function OrbitRing() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return (
    <group ref={ref}>
      {skills.map((skill, i) => {
        const angle = (i / skills.length) * Math.PI * 2;
        const radius = 2.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={skill.name} position={[x, 0, z]}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="#E8A020" />
            </mesh>
            <Html
              position={[0, 0.35, 0]}
              center
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '10px',
                color: '#F2EFE8',
                whiteSpace: 'nowrap',
                letterSpacing: '0.06em',
                opacity: 0.9,
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              {skill.name}
            </Html>
          </group>
        );
      })}
    </group>
  );
}

const SkillsOrbit = () => {
  return (
    <section id="skills-orbit" className="py-20 border-b border-[var(--border)]">
      <div className="max-w-[1160px] mx-auto px-8">
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
        <div className="relative w-full h-[320px] bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
            dpr={[1, 2]}
          >
            <color attach="background" args={['#111126']} />
            <ambientLight intensity={0.4} />
            <pointLight position={[4, 4, 4]} intensity={1} />
            <pointLight position={[-4, -2, 2]} intensity={0.5} color="#5B4FD8" />
            <OrbitRing />
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default SkillsOrbit;
