'use client';

import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { cn } from '@/lib/utils';
import { CropIcon, ImageIcon, Trash2, Upload, X } from 'lucide-react';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Field, FieldContent, FieldError } from './ui/field';
import { Slider } from './ui/slider';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

function Dropzone() {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [image, setImage] = useState('');
  const [croppedImage, setCroppedImage] = useState('');
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const {
    setValue,
    formState: { errors },
  } = useFormContext<CreateBlogInput>();

  const handleDropRejected = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const invalidType = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-invalid-type',
      );

      const fileTooLarge = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-too-large',
      );

      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'too-many-files',
      );

      if (invalidType) {
        toast.error('Invalid file type', {
          description: 'Please upload an image file (jpg, png, etc.)',
        });
      }

      if (fileTooLarge) {
        toast.error('File size exceeds limit', {
          description: 'Maximum file size is 3MB',
        });
      }

      if (tooManyFiles) {
        toast.error('Too many files', {
          description: 'Only one file is allowed',
        });
      }
    }
  };

  const onCropComplete = (_croppedArea: Area, croppedArea: Area) => {
    setCroppedArea(croppedArea);
  };

  const createCroppedImage = async () => {
    if (!image || !croppedArea) return;

    setIsCropping(true);

    try {
      if (croppedImage) {
        URL.revokeObjectURL(croppedImage);
      }

      const imageElement = new Image();
      imageElement.src = image;

      await new Promise((resolve, reject) => {
        imageElement.onload = resolve;
        imageElement.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = croppedArea.width;
      canvas.height = croppedArea.height;

      ctx.drawImage(
        imageElement,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height,
      );

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            setCroppedBlob(blob);
            const croppedUrl = URL.createObjectURL(blob);
            setCroppedImage(croppedUrl);

            const file = new File([blob], 'banner.webp', {
              type: 'image/webp',
            });
            setValue('banner', file, {
              shouldValidate: true,
              shouldDirty: true,
            });

            resolve();
          },
          'image/webp',
          0.75,
        );
      });
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image');
    } finally {
      setIsCropping(false);
    }
  };

  const handleDropAccepted = (files: File[]) => {
    // Clean up existing images first
    if (image) URL.revokeObjectURL(image);
    if (croppedImage) URL.revokeObjectURL(croppedImage);

    const imageUrl = URL.createObjectURL(files[0]);
    setImage(imageUrl);
    setIsDialogOpen(true);
    setCrop({ x: 0, y: 0 });
    setZoom(1);

    // Clear previous crop data
    setCroppedImage('');
    setCroppedBlob(null);
    setCroppedArea(null);
  };

  const handleCrop = async () => {
    await createCroppedImage();
    setIsDialogOpen(false);
  };

  const handleRecrop = () => {
    if (croppedBlob) {
      // IMPORTANT: Revoke the old cropped image URL first
      if (croppedImage) {
        URL.revokeObjectURL(croppedImage);
      }

      const imageUrl = URL.createObjectURL(croppedBlob);
      setImage(imageUrl);
      setIsDialogOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  const handleRemove = () => {
    if (croppedImage) {
      URL.revokeObjectURL(croppedImage);
    }
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImage('');
    setCroppedImage('');
    setCroppedBlob(null);
    setCroppedArea(null);

    // Clear the form field
    setValue('banner', undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCancel = () => {
    if (image) URL.revokeObjectURL(image);
    setTimeout(() => {
      setImage('');
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedArea(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
      if (croppedImage) URL.revokeObjectURL(croppedImage);
    };
  }, [image, croppedImage]);

  const {
    getInputProps,
    getRootProps,
    isDragActive,
    isFileDialogActive,
    isDragReject,
  } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024,
    onDropRejected: handleDropRejected,
    onDropAccepted: handleDropAccepted,
  });

  return (
    <Field>
      <div
        className={cn(
          'relative z-10 flex aspect-video cursor-pointer flex-col items-center justify-center gap-1 border-2 p-8 transition-colors',
          isDragActive
            ? isDragReject
              ? 'border-destructive/50 bg-destructive/15'
              : 'border-brand/50 bg-brand/15'
            : 'border-input',
          isFileDialogActive && 'border-brand/50 bg-brand/15',
          !(isDragActive || isDragReject || isFileDialogActive) &&
            'hover:bg-input/20',
          croppedImage && 'p-0',
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        {croppedImage && (
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-10',
              isDragActive
                ? isDragReject
                  ? 'bg-destructive/15'
                  : 'bg-brand/15'
                : 'bg-transparent',
              isFileDialogActive && 'bg-brand/15',
            )}
          />
        )}

        {croppedImage ? (
          <div className="group relative h-full w-full">
            <NextImage
              src={croppedImage}
              alt="Cover preview"
              fill
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              Tap or drag a new image to replace
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center rounded-full border p-2.5">
              {isDragActive ? (
                isDragReject ? (
                  <X className="text-destructive size-6" />
                ) : (
                  <Upload className="text-muted-foreground size-6" />
                )
              ) : (
                <ImageIcon className="text-muted-foreground size-6" />
              )}
            </div>
            {!isDragActive && (
              <>
                <p className="text-center text-sm font-medium">
                  Drag & drop your cover image here
                </p>
                <p className="text-muted-foreground text-center text-xs">
                  Or click to browse (max 3MB, 16:9 recommended)
                </p>

                <Button size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </>
            )}
            {isDragActive && (
              <p className="text-sm font-medium">Drop the image here...</p>
            )}
          </>
        )}
      </div>

      <FieldContent>
        {errors.banner && <FieldError errors={[errors.banner]} />}

        {croppedImage && (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              Tap or drag a new image to replace
            </p>

            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRecrop();
                    }}
                  >
                    <CropIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Re-crop</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                  >
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </FieldContent>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            handleCancel();
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Cover Image</DialogTitle>
            <DialogDescription>
              Adjust the crop area and zoom to fit your image
            </DialogDescription>
          </DialogHeader>

          <div className="bg-background relative aspect-video">
            <Cropper
              image={image}
              aspect={16 / 9}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="space-y-3">
            <div>
              <span className="w-10 text-right text-xs">
                {Math.round((zoom - 1) * 100)}%
              </span>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(v) => setZoom(v[0])}
              className="flex-1"
            />
          </div>

          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCrop} disabled={isCropping}>
              {isCropping ? <Spinner /> : <CropIcon />} Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Field>
  );
}

export default Dropzone;
