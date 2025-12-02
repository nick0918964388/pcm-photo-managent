import { Link } from 'react-router-dom';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const statusColor =
    project.status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';

  const statusText = project.status === 'active' ? '進行中' : '已結案';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm text-gray-500 font-mono">{project.code}</span>
          <h3 className="text-lg font-semibold text-gray-900 mt-1">
            {project.name}
          </h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
        >
          {statusText}
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        建立時間: {new Date(project.createdAt).toLocaleDateString('zh-TW')}
      </div>

      <div className="flex justify-between items-center">
        <Link
          to={`/projects/${project.id}/folders`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          進入相簿 →
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(project.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            刪除
          </button>
        )}
      </div>
    </div>
  );
}
