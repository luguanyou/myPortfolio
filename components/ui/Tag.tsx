import { cn } from "@/lib/utils"

export function Tag({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("badge", className)} {...props}>
      {children}
    </span>
  )
}
