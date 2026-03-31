import * as React from 'react';
import { toast } from 'sonner';

export type UploadedFile = {
  key: string;
  url: string;
  name: string;
  size: number;
  type: string;
};

interface UseUploadFileProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      // TODO: replace mock with real upload
      // 1. create POST /api/upload route using cloudinary.uploader.upload()
      // 2. call it here with FormData and replace mockFile with real response
      // 3. for progress tracking use axios onUploadProgress instead of fetch

      await simulateProgress(setProgress);

      const mockFile: UploadedFile = {
        key: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setUploadedFile(mockFile);
      onUploadComplete?.(mockFile);
      return mockFile;
    } catch (error) {
      onUploadError?.(error);
      toast.error('Upload failed, please try again.');
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return { isUploading, progress, uploadedFile, uploadFile, uploadingFile };
}

async function simulateProgress(setProgress: (p: number) => void) {
  for (let i = 1; i <= 10; i++) {
    await new Promise((r) => setTimeout(r, 100));
    setProgress(i * 10);
  }
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Something went wrong.';
}
