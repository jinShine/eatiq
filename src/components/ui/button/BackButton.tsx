"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft as ArrowLeftIcon } from "lucide-react";

import Button, { type ButtonProps } from "./Button";

export default function BackButton({ ...props }: ButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-accent rounded-full m-0"
      {...props}
      onClick={() => router.back()}
    >
      <ArrowLeftIcon />
    </Button>
  );
}
