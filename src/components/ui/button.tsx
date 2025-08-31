import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'btn transition-all';
    const variantStyles = {
      primary: 'btn-primary',
      secondary: 'btn-secondary', 
      outline: 'btn-outline',
      ghost: 'btn-ghost'
    };
    const sizeStyles = {
      sm: 'btn-sm',
      default: '',
      lg: 'btn-lg',
      icon: 'btn-icon'
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`.trim();

    return (
      <button
        className={classes}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="loading-spinner mr-2"></div>
            {children}
          </>
        ) : (
          children
        )}
      </button>
  )
})
Button.displayName = "Button"

export { Button }
