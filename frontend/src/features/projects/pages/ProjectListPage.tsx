import { useState } from 'react';
import { useProjects, useCreateProject, useDeleteProject } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { CreateProjectModal } from '../components/CreateProjectModal';
import type { CreateProjectDto } from '@/types';

export function ProjectListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: projects, isLoading, error } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const handleCreate = async (data: CreateProjectDto) => {
    try {
      await createProject.mutateAsync(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('建立專案失敗');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此專案嗎？此操作無法復原。')) {
      return;
    }

    try {
      await deleteProject.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('刪除專案失敗');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">載入失敗，請重新整理頁面</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              PCM 工程相片管理
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + 新增專案
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">尚無專案</div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              建立第一個專案
            </button>
          </div>
        )}
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={createProject.isPending}
      />
    </div>
  );
}
