"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploaderProps {
  onChange: (files: File[]) => void;
}

export default function FileUploader({ onChange }: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles);
    onChange(acceptedFiles); // Pass files to parent
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    multiple: true,
  });

  return (
    <div className="space-y-3">
      <Label>Upload Event Photos</Label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop the images here..."
            : "Drag & drop images here, or click to select"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Only images (jpg, png, gif) are allowed.</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="text-sm text-gray-700">
          {selectedFiles.length} file(s) selected:
          <ul className="mt-1 list-disc list-inside text-gray-500">
            {selectedFiles.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="mt-2"
        onClick={() => setSelectedFiles([])}
      >
        Clear Files
      </Button>
    </div>
  );
}
