import React from 'react';
import { ArchitecturalFrame } from './ArchitecturalFrame';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  hoverEffect?: boolean;
  'data-testid'?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className = '',
      onClick,
      hoverEffect = true,
      ...rest
    },
    ref
  ) => {
    return (
      <ArchitecturalFrame
        ref={ref}
        variant="card"
        hoverEffect={hoverEffect}
        onClick={onClick}
        className={className}
        {...rest}
      >
        {children}
      </ArchitecturalFrame>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
