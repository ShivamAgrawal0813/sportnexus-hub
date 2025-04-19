
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


export const uploadImage = async (
  file: File,
  bucket: string,
  folder: string = ''
): Promise<{ url: string | null; error: string | null }> => {
  try {
    console.log(`Attempting to upload to ${bucket}/${folder}`);
    
    // Basic validation
    if (!file) {
      return { url: null, error: 'No file provided' };
    }
    
    if (!bucket) {
      return { url: null, error: 'No bucket specified' };
    }
    
    // Make sure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      console.error(`Bucket '${bucket}' does not exist.`);
      return { url: null, error: `Bucket '${bucket}' not found` };
    }
    
    // Format path correctly for RLS
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    // If folder (usually user ID) is provided, use as first path segment for RLS
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    console.log(`Uploading to ${bucket}/${filePath}`);
    
    // Upload the file
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { url: null, error: uploadError.message };
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return { url: urlData.publicUrl, error: null };
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    return { url: null, error: error.message };
  }
};