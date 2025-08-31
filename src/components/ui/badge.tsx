import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClass = variant === "secondary" ? "badge-secondary" :
                      variant === "outline" ? "badge-outline" :
                      "badge-default"
  
  return (
    <div className={`badge ${variantClass} ${className || ""}`} {...props} />
  )
}

export { Badge }
