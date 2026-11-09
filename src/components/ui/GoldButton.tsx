import React from 'react';
import { AegyraButton, AegyraButtonVariant } from './AegyraButton';

export interface GoldButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass' | 'emerald';
  className?: string;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  'data-testid'?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  (
    {
      children,
      variant = 'primary',
      className = '',
      onClick,
      'data-testid': testId,
      type = 'button',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    // Map legacy gold button variants to AegyraButton variants
    const mappedVariant: AegyraButtonVariant =
      variant === 'primary'
        ? 'primary'
        : variant === 'glass'
        ? 'glass'
        : variant === 'emerald'
        ? 'emerald'
        : 'secondary';

    return (
      <AegyraButton
        ref={ref}
        variant={mappedVariant}
        type={type}
        disabled={disabled}
        onClick={onClick}
        data-testid={testId}
        className={className}
        {...rest}
      >
        {children}
      </AegyraButton>
    );
  }
);

GoldButton.displayName = 'GoldButton';

export default GoldButton;
