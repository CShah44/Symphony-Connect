"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { UploadDropzone } from "@/lib/utils";
import Image from "next/image";

export default function FileUploader({
  imageUrls,
  setImageUrls,
}: {
  imageUrls: Array<String>;
  setImageUrls: Dispatch<SetStateAction<String[]>>;
}) {
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
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`Could not upload that image. Check File Size again.`);
          }}
        />
      )}
    </>
  );
}
