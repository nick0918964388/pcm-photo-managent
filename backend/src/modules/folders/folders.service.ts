import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../../database/entities/folder.entity';
import { Project } from '../../database/entities/project.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

export interface BreadcrumbItem {
  id: string;
  name: string;
}

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findByProject(projectId: string, parentId?: string | null): Promise<Folder[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    const whereClause: Record<string, unknown> = { projectId };

    if (parentId !== undefined) {
      whereClause.parentId = parentId;
    }

    return this.folderRepository.find({
      where: whereClause,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID "${id}" not found`);
    }

    return folder;
  }

  async create(projectId: string, createFolderDto: CreateFolderDto): Promise<Folder> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    let parentPathString = '';

    if (createFolderDto.parentId) {
      const parent = await this.folderRepository.findOne({
        where: { id: createFolderDto.parentId },
      });

      if (!parent) {
        throw new NotFoundException(
          `Parent folder with ID "${createFolderDto.parentId}" not found`,
        );
      }

      parentPathString = parent.pathString || '';
    }

    const pathString = `${parentPathString}/${createFolderDto.name}`;

    const folder = this.folderRepository.create({
      ...createFolderDto,
      projectId,
      pathString,
    });

    return this.folderRepository.save(folder);
  }

  async update(id: string, updateFolderDto: UpdateFolderDto): Promise<Folder> {
    const folder = await this.findOne(id);

    if (updateFolderDto.name) {
      // Update pathString when name changes
      const parentPath = folder.pathString
        ? folder.pathString.substring(0, folder.pathString.lastIndexOf('/'))
        : '';
      folder.pathString = `${parentPath}/${updateFolderDto.name}`;
    }

    Object.assign(folder, updateFolderDto);

    return this.folderRepository.save(folder);
  }

  async remove(id: string): Promise<void> {
    const folder = await this.findOne(id);
    await this.folderRepository.remove(folder);
  }

  async getBreadcrumb(id: string): Promise<BreadcrumbItem[]> {
    const breadcrumb: BreadcrumbItem[] = [];
    let currentFolder = await this.folderRepository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!currentFolder) {
      throw new NotFoundException(`Folder with ID "${id}" not found`);
    }

    while (currentFolder) {
      breadcrumb.unshift({
        id: currentFolder.id,
        name: currentFolder.name,
      });

      if (currentFolder.parentId) {
        currentFolder = await this.folderRepository.findOne({
          where: { id: currentFolder.parentId },
          relations: ['parent'],
        });
      } else {
        break;
      }
    }

    return breadcrumb;
  }
}
