import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
  projectId: string;
  projectName: string;
  items: BreadcrumbItem[];
}

export function Breadcrumb({ projectId, projectName, items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link
        to="/projects"
        className="hover:text-blue-600"
      >
        專案列表
      </Link>
      <span>/</span>
      <Link
        to={`/projects/${projectId}/folders`}
        className="hover:text-blue-600"
      >
        {projectName}
      </Link>
      {items.map((item, index) => (
        <span key={item.id} className="flex items-center space-x-2">
          <span>/</span>
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <Link
              to={`/projects/${projectId}/folders/${item.id}`}
              className="hover:text-blue-600"
            >
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
