
export interface UploadedImage {
  id: string;
  file: File;
  originalUrl: string;
  editedUrl: string | null;
  isLoading: boolean;
  caption?: string;
  isGettingCaption: boolean;
}
