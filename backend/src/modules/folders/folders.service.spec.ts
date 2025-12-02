import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoldersService } from './folders.service';
import { Folder } from '../../database/entities/folder.entity';
import { Project, ProjectStatus } from '../../database/entities/project.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { NotFoundException } from '@nestjs/common';

describe('FoldersService', () => {
  let service: FoldersService;
  let folderRepository: jest.Mocked<Repository<Folder>>;
  let projectRepository: jest.Mocked<Repository<Project>>;

  const mockProject: Project = {
    id: 'project-uuid',
    code: 'PROJ-001',
    name: 'Test Project',
    status: ProjectStatus.ACTIVE,
    folders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFolder: Folder = {
    id: 'folder-uuid',
    projectId: mockProject.id,
    project: mockProject,
    parentId: null,
    parent: null,
    children: [],
    name: 'Test Folder',
    pathString: '/Test Folder',
    assets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockFolderRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const mockProjectRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoldersService,
        {
          provide: getRepositoryToken(Folder),
          useValue: mockFolderRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
      ],
    }).compile();

    service = module.get<FoldersService>(FoldersService);
    folderRepository = module.get(getRepositoryToken(Folder));
    projectRepository = module.get(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByProject', () => {
    it('should return folders for a project', async () => {
      const folders = [mockFolder];
      projectRepository.findOne.mockResolvedValue(mockProject);
      folderRepository.find.mockResolvedValue(folders);

      const result = await service.findByProject(mockProject.id);

      expect(result).toEqual(folders);
    });

    it('should throw NotFoundException when project not found', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      await expect(service.findByProject('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should filter by parentId when provided', async () => {
      projectRepository.findOne.mockResolvedValue(mockProject);
      folderRepository.find.mockResolvedValue([mockFolder]);

      await service.findByProject(mockProject.id, 'parent-uuid');

      expect(folderRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { projectId: mockProject.id, parentId: 'parent-uuid' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a folder by id', async () => {
      folderRepository.findOne.mockResolvedValue(mockFolder);

      const result = await service.findOne(mockFolder.id);

      expect(result).toEqual(mockFolder);
    });

    it('should throw NotFoundException when folder not found', async () => {
      folderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createDto: CreateFolderDto = {
      name: 'New Folder',
    };

    it('should create a folder in root level', async () => {
      projectRepository.findOne.mockResolvedValue(mockProject);
      folderRepository.create.mockReturnValue({
        ...mockFolder,
        name: createDto.name,
      });
      folderRepository.save.mockResolvedValue({
        ...mockFolder,
        name: createDto.name,
        pathString: '/New Folder',
      });

      const result = await service.create(mockProject.id, createDto);

      expect(result.name).toEqual(createDto.name);
      expect(folderRepository.create).toHaveBeenCalled();
    });

    it('should create a subfolder with parent', async () => {
      const parentFolder = { ...mockFolder, id: 'parent-uuid' };
      projectRepository.findOne.mockResolvedValue(mockProject);
      folderRepository.findOne.mockResolvedValue(parentFolder);
      folderRepository.create.mockReturnValue({
        ...mockFolder,
        parentId: parentFolder.id,
      });
      folderRepository.save.mockResolvedValue({
        ...mockFolder,
        parentId: parentFolder.id,
        pathString: '/Test Folder/New Folder',
      });

      const result = await service.create(mockProject.id, {
        ...createDto,
        parentId: parentFolder.id,
      });

      expect(result.parentId).toEqual(parentFolder.id);
    });
  });

  describe('getBreadcrumb', () => {
    it('should return breadcrumb path for a folder', async () => {
      const grandparent: Folder = {
        ...mockFolder,
        id: 'grandparent-uuid',
        name: 'Grandparent',
        parentId: null,
        parent: null,
      };
      const parent: Folder = {
        ...mockFolder,
        id: 'parent-uuid',
        name: 'Parent',
        parentId: grandparent.id,
        parent: grandparent,
      };
      const folder: Folder = {
        ...mockFolder,
        id: 'folder-uuid',
        name: 'Current',
        parentId: parent.id,
        parent: parent,
      };

      folderRepository.findOne
        .mockResolvedValueOnce(folder)
        .mockResolvedValueOnce(parent)
        .mockResolvedValueOnce(grandparent);

      const result = await service.getBreadcrumb(folder.id);

      expect(result).toHaveLength(3);
      expect(result[0].name).toEqual('Grandparent');
      expect(result[1].name).toEqual('Parent');
      expect(result[2].name).toEqual('Current');
    });
  });

  describe('remove', () => {
    it('should remove a folder', async () => {
      folderRepository.findOne.mockResolvedValue(mockFolder);
      folderRepository.remove.mockResolvedValue(mockFolder);

      await service.remove(mockFolder.id);

      expect(folderRepository.remove).toHaveBeenCalledWith(mockFolder);
    });

    it('should throw NotFoundException when folder not found', async () => {
      folderRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
