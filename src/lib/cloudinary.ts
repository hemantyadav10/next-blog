// Configuration
import {
  v2 as cloudinary,
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
