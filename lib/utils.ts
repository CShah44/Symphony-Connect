import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateUploadDropzone } from "@uploadthing/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
