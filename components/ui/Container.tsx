import { cn } from "@/lib/utils"

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container-custom", className)} {...props}>
      {children}
    </div>
  )
}
