
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Constants for storage buckets
export const BUCKET_PROFILES = 'profiles';
export const BUCKET_VENUES = 'venues';
export const BUCKET_EQUIPMENT = 'equipment';
export const BUCKET_TUTORIALS = 'tutorials';

export interface UploadOptions {
  bucket: string;
  path?: string;
  upsert?: boolean;
  onProgress?: (progress: number) => void;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  file: File, 
  options: UploadOptions
): Promise<string | null> => {
  try {
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = options.path 
      ? `${options.path}/${fileName}` 
      : fileName;

    // Set up upload with optional progress tracking
    const { error, data } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: options.upsert || false,
      });

    if (error) throw error;
    
    // Get public URL
    const result = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path);
      
    return result.data.publicUrl;
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    toast.error('Failed to upload file');
    return null;
  }
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  path: string, 
  bucket: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting file:', error.message);
    toast.error('Failed to delete file');
    return false;
  }
};

/**
 * Get a signed URL for a file (useful for private files)
 */
export const getSignedUrl = async (
  path: string, 
  bucket: string,
  expiresIn = 60 // seconds
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  } catch (error: any) {
    console.error('Error generating signed URL:', error.message);
    return null;
  }
};

/**
 * Create a temporary upload URL for client-side uploads
 */
export const createUploadUrl = async (
  bucket: string,
  path: string,
  options = { upsert: false }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path, { upsert: options.upsert });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating upload URL:', error.message);
    return null;
  }
};
