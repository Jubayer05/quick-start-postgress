"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoProps = {
  href?: string;
  src: string;
  alt: string;
  title?: string;
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
};

export function Logo({
  href = "/",
  src,
  alt,
  title,
  className,
  imageClassName,
  titleClassName,
}: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <Image
        src={src}
        width={32}
        height={32}
        className={cn("h-8 w-auto dark:invert", imageClassName)}
        alt={alt}
        priority
      />
      {title ? (
        <span className={cn("text-lg font-semibold tracking-tighter", titleClassName)}>
          {title}
        </span>
      ) : null}
    </Link>
  );
}

