import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag } from "./Tag";

type ProjectCardProps = Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "href" | "children"
> & {
  title: string;
  description: string;
  tags: string[];
  href: string;
  thumbnailText?: string;
};

export function ProjectCard({ 
  title, 
  description, 
  tags, 
  href, 
  thumbnailText = "缩略图占位",
  className,
  ...props 
}: ProjectCardProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "card-base card-hover block group no-underline hover:no-underline",
        className
      )}
      {...props}
    >
      <div className="h-[160px] border-b border-[var(--border)] bg-[var(--bg-muted)] rounded-t-[var(--radius-md)] grid place-items-center text-[var(--text-muted)] text-[13px]">
        {thumbnailText}
      </div>
      <div className="p-[20px]">
        <h3 className="text-[16px] font-bold mb-[6px] group-hover:text-[var(--primary)] transition-colors">
          {title}
        </h3>
        <p className="text-[14px] text-[var(--text-muted)] mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
