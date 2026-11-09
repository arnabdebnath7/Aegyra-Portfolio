import React from 'react';

export type AegyraButtonVariant = 'primary' | 'glass' | 'emerald' | 'secondary';
export type AegyraButtonSize = 'sm' | 'md' | 'lg';

export interface AegyraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: AegyraButtonVariant;
  size?: AegyraButtonSize;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  'data-testid'?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const AegyraButton = React.forwardRef<HTMLButtonElement, AegyraButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      onClick,
      'data-testid': testId,
      type = 'button',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold tracking-wider uppercase transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-canvas disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none select-none';

    const sizeStyles: Record<AegyraButtonSize, string> = {
      sm: 'px-4 py-2 text-[11px]',
      md: 'px-6 py-3 text-xs md:text-sm',
      lg: 'px-8 py-3.5 text-sm md:text-base',
    };

    const variantStyles: Record<AegyraButtonVariant, string> = {
      // Primary: Sunlit Amber pill (Image 5 CTA reference)
      primary:
        'bg-amber-sunlit text-stone-canvas hover:bg-amber-highlight shadow-lg shadow-amber-base/20 hover:shadow-amber-base/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-amber-sunlit',
      // Glass: Crystalline translucent pill with subtle brass border
      glass:
        'glass-pill text-stone-marble hover:text-amber-highlight hover:border-amber-sunlit hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-amber-sunlit/60 shadow-sm',
      // Emerald: Botanical badge / flora accent
      emerald:
        'bg-emerald-base/20 border border-emerald-vibrant/40 text-emerald-glow hover:bg-emerald-base/30 hover:border-emerald-glow hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-emerald-glow shadow-sm',
      // Secondary: Sandstone travertine frame with warm bronze trim
      secondary:
        'border border-amber-warm/50 text-amber-sunlit bg-stone-surface/60 hover:bg-amber-warm/15 hover:border-amber-sunlit hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-amber-warm shadow-sm',
    };

    return (
      <button
        ref={ref}
        type={type}
        data-testid={testId}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AegyraButton.displayName = 'AegyraButton';

export default AegyraButton;
