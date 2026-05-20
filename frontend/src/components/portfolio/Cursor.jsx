import React, { useEffect, useRef } from 'react';

const Cursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let isMoving = false;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
      isMoving = true;
    };

    const animRing = () => {
      if (isMoving) {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
      }
      requestAnimationFrame(animRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationFrameId = requestAnimationFrame(animRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} id="cursor" />
      <div ref={ringRef} id="cursor-ring" />
    </>
  );
};

export default Cursor;
