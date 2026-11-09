import React from 'react';

export type ArchitecturalFrameVariant = 'default' | 'card' | 'panel' | 'ground' | 'interactive';

export interface ArchitecturalFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: ArchitecturalFrameVariant;
  hoverEffect?: boolean;
  active?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  'data-testid'?: string;
}

export const ArchitecturalFrame = React.forwardRef<HTMLDivElement, ArchitecturalFrameProps>(
  (
    {
      children,
      variant = 'default',
      hoverEffect = false,
      active = false,
      className = '',
      onClick,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    // Base crystalline travertine glass panel with antique brass trim
    const baseStyles =
      'glass-panel relative transition-all duration-300 ease-out border border-amber-warm/25';

    const variantStyles: Record<ArchitecturalFrameVariant, string> = {
      default: 'rounded-2xl p-4 md:p-6',
      card: 'rounded-2xl p-4 md:p-6 shadow-md shadow-stone-canvas/50',
      panel: 'rounded-3xl p-6 md:p-8 shadow-2xl shadow-stone-canvas/70',
      ground:
        'rounded-xl p-3 md:p-4 bg-stone-surface/75 border-amber-warm/30 backdrop-blur-md',
      interactive:
        'rounded-2xl p-4 cursor-pointer hover:bg-stone-surface-alt/70 hover:border-amber-sunlit/60',
    };

    const hoverStyles = hoverEffect
      ? 'hover:border-amber-sunlit/60 hover:shadow-lg hover:shadow-amber-base/15 hover:-translate-y-0.5 cursor-pointer'
      : '';

    const activeStyles = active
      ? 'border-amber-sunlit/80 shadow-lg shadow-amber-base/20 ring-1 ring-amber-sunlit/40'
      : '';

    return (
      <div
        ref={ref}
        data-testid={testId}
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${activeStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ArchitecturalFrame.displayName = 'ArchitecturalFrame';

export default ArchitecturalFrame;
