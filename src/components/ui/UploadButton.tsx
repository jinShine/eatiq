"use client";

import type { ButtonHTMLAttributes, ChangeEvent, ReactNode } from "react";

import { cn } from "@utils/shadcn";

type UploadButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  accept: string | undefined;
  multiple?: boolean;
  className?: string;
  children: ReactNode;

  onChangeFile: (files: Array<{ file: File; previewURL: string }>) => void;
};

export default function UploadButton({
  accept,
  multiple,
  onChangeFile,
  children,
  className,
  ...props
}: UploadButtonProps) {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const processedFiles = await Promise.all(
      files.map(async file => {
        let processedFile = file;
        let imageURL: string;

        if (file.type.includes("heif") || file.type.includes("heic")) {
          const jpgFile = (await convertHeicToJpg(file)) || file;
          processedFile = jpgFile;
          imageURL = previewImageURL(jpgFile);
        } else {
          imageURL = previewImageURL(file);
        }

        return {
          file: processedFile,
          previewURL: imageURL,
        };
      }),
    );

    onChangeFile(processedFiles);
  };

  return (
    <button
      {...props}
      className={cn("relative", className)}
      onClick={e => {
        e.preventDefault();
        const input = e.currentTarget.querySelector("input");
        input?.click();
      }}
    >
      {children}
      <input
        className="hidden"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        onClick={e => {
          e.stopPropagation();
          (e.target as HTMLInputElement).value = "";
        }}
        multiple={multiple}
      />
    </button>
  );
}

/**
 * Utils
 */

async function convertHeicToJpg(file: File) {
  try {
    if (typeof window !== "undefined") {
      const heic2any = (await import("heic2any")).default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob: any = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 1,
      });

      const newFile = new File([blob], file.name.split(".")[0] + ".jpg", {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });

      return newFile;
    }

    return undefined;
  } catch (error) {
    console.error("HEIC 변환 중 오류:", error);
    throw error;
  }
}

const previewImageURL = (file: File) => {
  const imageURL = URL.createObjectURL(file);

  setTimeout(() => {
    URL.revokeObjectURL(imageURL);
  }, 60000);

  return imageURL;
};
