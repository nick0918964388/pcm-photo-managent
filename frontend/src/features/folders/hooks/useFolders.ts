import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { folderApi } from '../api/folderApi';
import type { CreateFolderDto, UpdateFolderDto } from '@/types';

const FOLDERS_QUERY_KEY = ['folders'];

export function useFolders(projectId: string, parentId?: string | null) {
  return useQuery({
    queryKey: [...FOLDERS_QUERY_KEY, projectId, parentId],
    queryFn: () => folderApi.getByProject(projectId, parentId),
    enabled: !!projectId,
  });
}

export function useFolder(id: string) {
  return useQuery({
    queryKey: [...FOLDERS_QUERY_KEY, 'detail', id],
    queryFn: () => folderApi.getById(id),
    enabled: !!id,
  });
}

export function useBreadcrumb(folderId: string | undefined) {
  return useQuery({
    queryKey: [...FOLDERS_QUERY_KEY, 'breadcrumb', folderId],
    queryFn: () => folderApi.getBreadcrumb(folderId!),
    enabled: !!folderId,
  });
}

export function useCreateFolder(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFolderDto) => folderApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...FOLDERS_QUERY_KEY, projectId] });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderDto }) =>
      folderApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => folderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
    },
  });
}
