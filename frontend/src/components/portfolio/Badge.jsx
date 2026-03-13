import React from 'react';

const variantClass = {
  gold: 'badge-gold',
  cosmic: 'badge-cosmic',
  cyan: 'badge-cyan',
  terra: 'badge-terra',
};

/**
 * Design-system Badge (DESIGN-SYSTEM.md §06).
 * Variants: gold (sungold), cosmic (violet), cyan (stardust), terra (terracotta).
 */
const Badge = ({ variant = 'gold', className = '', children, as: Component = 'span', ...props }) => (
  <Component
    className={`badge ${variantClass[variant] || variantClass.gold} ${className}`.trim()}
    {...props}
  >
    {children}
  </Component>
);

export default Badge;
