import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FoldersService, BreadcrumbItem } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder } from '../../database/entities/folder.entity';

@Controller('api')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get('projects/:projectId/folders')
  async findByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query('parentId') parentId?: string,
  ): Promise<Folder[]> {
    // Convert 'null' string to actual null, undefined means no filter
    const parsedParentId = parentId === 'null' ? null : parentId;
    return this.foldersService.findByProject(projectId, parsedParentId);
  }

  @Post('projects/:projectId/folders')
  async create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<Folder> {
    return this.foldersService.create(projectId, createFolderDto);
  }

  @Get('folders/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Folder> {
    return this.foldersService.findOne(id);
  }

  @Get('folders/:id/breadcrumb')
  async getBreadcrumb(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BreadcrumbItem[]> {
    return this.foldersService.getBreadcrumb(id);
  }

  @Patch('folders/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ): Promise<Folder> {
    return this.foldersService.update(id, updateFolderDto);
  }

  @Delete('folders/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.foldersService.remove(id);
  }
}
