import React from 'react';

interface GoldButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
  onClick?: () => void;
  'data-testid'?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  'data-testid': testId,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-sans text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-bright focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gold-bright text-void hover:bg-gold-champagne shadow-lg shadow-gold-primary/20 hover:shadow-gold-primary/30 hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'border border-gold-primary/50 text-gold-bright bg-surface-glass hover:bg-gold-primary/10 hover:border-gold-bright shadow-sm hover:scale-[1.02] active:scale-[0.98]',
    glass:
      'glass-pill text-neutral-200 hover:text-gold-bright hover:border-gold-bright/60 hover:scale-[1.02] active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      data-testid={testId}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default GoldButton;
