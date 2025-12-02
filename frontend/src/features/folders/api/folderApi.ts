import api from '@/lib/api';
import type { Folder, CreateFolderDto, UpdateFolderDto, BreadcrumbItem } from '@/types';

export const folderApi = {
  getByProject: async (projectId: string, parentId?: string | null): Promise<Folder[]> => {
    const params = parentId !== undefined ? { parentId: parentId ?? 'null' } : {};
    const response = await api.get<Folder[]>(`/projects/${projectId}/folders`, { params });
    return response.data;
  },

  getById: async (id: string): Promise<Folder> => {
    const response = await api.get<Folder>(`/folders/${id}`);
    return response.data;
  },

  getBreadcrumb: async (id: string): Promise<BreadcrumbItem[]> => {
    const response = await api.get<BreadcrumbItem[]>(`/folders/${id}/breadcrumb`);
    return response.data;
  },

  create: async (projectId: string, data: CreateFolderDto): Promise<Folder> => {
    const response = await api.post<Folder>(`/projects/${projectId}/folders`, data);
    return response.data;
  },

  update: async (id: string, data: UpdateFolderDto): Promise<Folder> => {
    const response = await api.patch<Folder>(`/folders/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/folders/${id}`);
  },
};
