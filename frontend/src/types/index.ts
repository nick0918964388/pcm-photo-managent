// Project types
export interface Project {
  id: string;
  code: string;
  name: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  code: string;
  name: string;
}

export interface UpdateProjectDto {
  name?: string;
  status?: 'active' | 'closed';
}

// Folder types
export interface Folder {
  id: string;
  projectId: string;
  parentId: string | null;
  name: string;
  pathString: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderDto {
  name: string;
  parentId?: string;
}

export interface UpdateFolderDto {
  name?: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

// Media Asset types
export interface MediaMetadata {
  originalName?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  exif?: Record<string, unknown>;
  gps?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface MediaAsset {
  id: string;
  folderId: string;
  uploaderId: string;
  fileKey: string;
  fileType: 'image' | 'video';
  metadata: MediaMetadata | null;
  createdAt: string;
  thumbnailUrl?: string;
  originalUrl?: string;
}

export interface CreateAssetDto {
  folderId: string;
  fileKey: string;
  fileType: 'image' | 'video';
  metadata?: MediaMetadata;
}

// Upload types
export interface SignUploadRequest {
  folderId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface SignUploadResponse {
  uploadUrl: string;
  fileKey: string;
  expiresAt: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
