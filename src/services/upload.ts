
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { BUCKET_PROFILES, BUCKET_VENUES, BUCKET_EQUIPMENT, BUCKET_TUTORIALS } from './storage';

export interface UploadResult {
  url: string | null;
  error: string | null;
}

export const uploadImage = async (
  file: File,
  bucket: string,
  folder: string = ''
): Promise<UploadResult> => {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.');
      return { url: null, error: 'Invalid file type' };
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.');
      return { url: null, error: 'File too large' };
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const filePath = folder 
      ? `${folder}/${Date.now()}.${fileExt}`
      : `${Date.now()}.${fileExt}`;
      
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image');
      return { url: null, error: error.message };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    toast.error('Failed to upload image');
    return { url: null, error: error.message };
  }
};

export const deleteImage = async (
  path: string,
  bucket: string
): Promise<boolean> => {
  try {
    if (!path) return false;
    
    // Extract the file path from the URL
    const urlParts = path.split(`${bucket}/`);
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
      
    if (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete image');
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in deleteImage:', error);
    return false;
  }
};
