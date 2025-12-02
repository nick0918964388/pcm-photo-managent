import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project, ProjectStatus } from '../../database/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: jest.Mocked<Repository<Project>>;

  const mockProject: Project = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    code: 'PROJ-001',
    name: 'Test Project',
    status: ProjectStatus.ACTIVE,
    folders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repository = module.get(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects = [mockProject];
      repository.find.mockResolvedValue(projects);

      const result = await service.findAll();

      expect(result).toEqual(projects);
      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      repository.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne(mockProject.id);

      expect(result).toEqual(mockProject);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockProject.id },
      });
    });

    it('should throw NotFoundException when project not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createDto: CreateProjectDto = {
      code: 'PROJ-002',
      name: 'New Project',
    };

    it('should create a new project', async () => {
      const newProject = { ...mockProject, ...createDto };
      repository.findOne.mockResolvedValue(null); // No existing project with same code
      repository.create.mockReturnValue(newProject);
      repository.save.mockResolvedValue(newProject);

      const result = await service.create(createDto);

      expect(result).toEqual(newProject);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(newProject);
    });

    it('should throw ConflictException when project code already exists', async () => {
      repository.findOne.mockResolvedValue(mockProject);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateProjectDto = {
      name: 'Updated Project Name',
    };

    it('should update an existing project', async () => {
      const updatedProject = { ...mockProject, ...updateDto };
      repository.findOne.mockResolvedValue(mockProject);
      repository.save.mockResolvedValue(updatedProject);

      const result = await service.update(mockProject.id, updateDto);

      expect(result).toEqual(updatedProject);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when project not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an existing project', async () => {
      repository.findOne.mockResolvedValue(mockProject);
      repository.remove.mockResolvedValue(mockProject);

      await service.remove(mockProject.id);

      expect(repository.remove).toHaveBeenCalledWith(mockProject);
    });

    it('should throw NotFoundException when project not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
