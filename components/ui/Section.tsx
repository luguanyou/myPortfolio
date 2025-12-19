import { cn } from "@/lib/utils"

export function Section({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-[48px]", className)} {...props}>
      {children}
    </section>
  )
}
