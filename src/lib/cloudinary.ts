// Configuration
import {
  v2 as cloudinary,
  DeleteApiResponse,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadResult =
  | { success: true; url: string; publicId: string }
  | { success: false; error: string };

type DeleteResult =
  | { success: true; result: DeleteApiResponse }
  | { success: false; error: string };

export const uploadOnCloudinary = async (
  file: File,
  folder: string = 'uploads',
): Promise<UploadResult> => {
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'auto', folder },
          function (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) {
            if (error) {
              reject(error);
              return;
            }
            if (!result) {
              reject(new Error('Upload result is undefined'));
              return;
            }
            resolve(result);
          },
        )
        .end(buffer);
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image.',
    };
  }
};

export const deleteFromCloudinary = async (
  publicId: string,
  options: {
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
    invalidate?: boolean;
    type?: 'upload' | 'private' | 'authenticated';
  } = {},
): Promise<DeleteResult> => {
  // Validate publicId
  if (!publicId || typeof publicId !== 'string') {
    return {
      success: false,
      error: 'Invalid publicId provided.',
    };
  }
  try {
    const result = await new Promise<DeleteApiResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: 'image',
          invalidate: true,
          type: 'upload',
          ...options,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: DeleteApiResponse | undefined,
        ) => {
          if (error) {
            reject(error);
            return;
          }
          if (!result) {
            reject(new Error('Delete result is undefined'));
            return;
          }
          resolve(result);
        },
      );
    });

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete from Cloudinary.',
    };
  }
};
