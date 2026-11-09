import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-4 md:p-6 transition-all duration-300 ${
        hoverEffect
          ? 'hover:border-gold-bright/40 hover:shadow-lg hover:shadow-gold-primary/10 hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
