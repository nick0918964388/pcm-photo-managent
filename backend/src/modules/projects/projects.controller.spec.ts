import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectStatus } from '../../database/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: jest.Mocked<ProjectsService>;

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
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects = [mockProject];
      service.findAll.mockResolvedValue(projects);

      const result = await controller.findAll();

      expect(result).toEqual(projects);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      service.findOne.mockResolvedValue(mockProject);

      const result = await controller.findOne(mockProject.id);

      expect(result).toEqual(mockProject);
      expect(service.findOne).toHaveBeenCalledWith(mockProject.id);
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createDto: CreateProjectDto = {
        code: 'PROJ-002',
        name: 'New Project',
      };
      const newProject = { ...mockProject, ...createDto };
      service.create.mockResolvedValue(newProject);

      const result = await controller.create(createDto);

      expect(result).toEqual(newProject);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing project', async () => {
      const updateDto: UpdateProjectDto = {
        name: 'Updated Project Name',
      };
      const updatedProject = { ...mockProject, ...updateDto };
      service.update.mockResolvedValue(updatedProject);

      const result = await controller.update(mockProject.id, updateDto);

      expect(result).toEqual(updatedProject);
      expect(service.update).toHaveBeenCalledWith(mockProject.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an existing project', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(mockProject.id);

      expect(service.remove).toHaveBeenCalledWith(mockProject.id);
    });
  });
});
