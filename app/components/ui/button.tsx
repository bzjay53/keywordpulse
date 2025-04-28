"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      ghost: 'hover:bg-gray-100 text-gray-700 hover:text-gray-900',
      link: 'text-primary-600 underline-offset-4 hover:underline',
    }
    
    const sizes = {
      default: 'h-10 py-2 px-4',
      sm: 'h-8 py-1 px-3 text-sm',
      lg: 'h-12 py-3 px-6 text-lg',
      icon: 'h-10 w-10',
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button } 