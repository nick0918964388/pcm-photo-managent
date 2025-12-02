import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '@/features/projects/hooks/useProjects';
import { useFolders, useBreadcrumb, useCreateFolder, useDeleteFolder } from '../hooks/useFolders';
import { Breadcrumb } from '../components/Breadcrumb';
import { FolderCard } from '../components/FolderCard';
import { CreateFolderModal } from '../components/CreateFolderModal';
import type { CreateFolderDto } from '@/types';

export function FolderBrowserPage() {
  const { projectId, folderId } = useParams<{ projectId: string; folderId?: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(projectId!);
  const { data: folders, isLoading: foldersLoading } = useFolders(
    projectId!,
    folderId ?? null
  );
  const { data: breadcrumb } = useBreadcrumb(folderId);

  const createFolder = useCreateFolder(projectId!);
  const deleteFolder = useDeleteFolder();

  const handleCreate = async (data: CreateFolderDto) => {
    try {
      await createFolder.mutateAsync(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create folder:', err);
      alert('建立資料夾失敗');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此資料夾嗎？資料夾內的所有內容將一併刪除。')) {
      return;
    }

    try {
      await deleteFolder.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete folder:', err);
      alert('刪除資料夾失敗');
    }
  };

  if (projectLoading || foldersLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">專案不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <Breadcrumb
                projectId={projectId!}
                projectName={project.name}
                items={breadcrumb ?? []}
              />
              <h1 className="text-2xl font-bold text-gray-900">
                {folderId ? breadcrumb?.[breadcrumb.length - 1]?.name : project.name}
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + 新增資料夾
              </button>
              <Link
                to="/projects"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                返回專案列表
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Folders Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">資料夾</h2>
          {folders && folders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  projectId={projectId!}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              尚無資料夾
            </div>
          )}
        </section>

        {/* Photos Section - Placeholder for Phase 1.4 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">相片</h2>
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
            相片瀏覽功能將在 Phase 1.4 實作 (使用 react-photo-album)
          </div>
        </section>
      </main>

      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={createFolder.isPending}
        parentId={folderId}
      />
    </div>
  );
}
