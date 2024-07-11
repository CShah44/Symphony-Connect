"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { UploadDropzone } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "../ui/use-toast";

export default function FileUploader({
  imageUrls,
  setImageUrls,
}: {
  imageUrls: Array<string>;
  setImageUrls: Dispatch<SetStateAction<string[]>>;
}) {
  const { toast } = useToast();

  function handleRemoveImage(indexToRemove: number) {
    const updatedImages = imageUrls.filter(
      (item, index) => index !== indexToRemove
    );
    setImageUrls(updatedImages);
  }

  return (
    <>
      {imageUrls.length >= 1 ? (
        <div className="flex items-center w-full gap-4 flex-wrap p-4">
          {imageUrls.map((item, i) => {
            return (
              <div key={i} className="relative m-3">
                <button
                  onClick={() => handleRemoveImage(i)}
                  className="absolute -right-3 -top-3 bg-slate-800 rounded-full"
                >
                  X
                </button>
                <Image
                  src={item}
                  className="rounded"
                  alt="some image"
                  width={100}
                  height={100}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res: any) => {
            const urls = res?.map((file: any) => file.url);
            setImageUrls(urls);
            toast({
              title: "Images Uploaded!",
            });
          }}
          onUploadError={(error: Error) => {
            toast({
              title: "Error uploading images",
              description: "Couldn't upload images, check the file size once",
              variant: "destructive",
            });
          }}
        />
      )}
    </>
  );
}
