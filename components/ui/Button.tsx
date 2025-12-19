import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "primary" | "outline" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Mapping variants to our CSS classes
    const variantClasses = {
      default: "btn",
      primary: "btn btn-primary",
      outline: "btn border-slate-200 bg-transparent hover:bg-slate-50",
      ghost: "btn border-transparent bg-transparent hover:bg-slate-100 shadow-none",
    }

    return (
      <Comp
        className={cn(variantClasses[variant], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
