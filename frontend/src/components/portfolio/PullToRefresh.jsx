import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PullToRefresh = ({ children, onRefresh }) => {
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Only apply on mobile devices where 'ontouchstart' is present
    if (!('ontouchstart' in window)) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling || refreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 0 && window.scrollY === 0) {
        // Prevent default scrolling when pulling down at the top
        e.preventDefault();
        controls.set({ y: Math.min(diff * 0.4, 80) });
      }
    };

    const handleTouchEnd = async (e) => {
      if (!isPulling || refreshing) return;
      setIsPulling(false);

      const currentY = e.changedTouches[0].clientY;
      const diff = currentY - startY;

      if (diff > 80 && window.scrollY === 0) {
        setRefreshing(true);
        controls.start({ y: 80, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        
        // Trigger haptic feedback if available natively
        if (navigator.vibrate) navigator.vibrate(10);
        
        await onRefresh();
        
        setRefreshing(false);
        controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      } else {
        controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, startY, refreshing, controls, onRefresh]);

  return (
    <div className="relative w-full h-full">
      <motion.div
        className="fixed top-0 left-0 right-0 flex justify-center items-center pointer-events-none z-[49] h-[56px] mt-[10px]"
        animate={controls}
        initial={{ y: -60 }}
      >
        <div className={`transition-opacity duration-200 ${refreshing || isPulling ? 'opacity-100' : 'opacity-0'}`}>
           <Loader2 className={`w-6 h-6 text-[var(--sungold)] ${refreshing ? 'animate-spin' : ''}`} />
        </div>
      </motion.div>

      <motion.div
        animate={controls}
        className="relative z-10 bg-[var(--void)]"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
