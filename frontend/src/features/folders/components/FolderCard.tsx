import { Link } from 'react-router-dom';
import type { Folder } from '@/types';

interface FolderCardProps {
  folder: Folder;
  projectId: string;
  onDelete?: (id: string) => void;
}

export function FolderCard({ folder, projectId, onDelete }: FolderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex items-center justify-between">
      <Link
        to={`/projects/${projectId}/folders/${folder.id}`}
        className="flex items-center space-x-3 flex-1"
      >
        <div className="text-3xl">📁</div>
        <div>
          <h3 className="font-medium text-gray-900">{folder.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(folder.createdAt).toLocaleDateString('zh-TW')}
          </p>
        </div>
      </Link>

      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(folder.id);
          }}
          className="text-red-500 hover:text-red-700 p-2"
          title="刪除資料夾"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
