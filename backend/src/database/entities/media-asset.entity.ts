import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Folder } from './folder.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface MediaMetadata {
  originalName?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  exif?: Record<string, unknown>;
  gps?: {
    latitude?: number;
    longitude?: number;
  };
  [key: string]: unknown;
}

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Folder, (folder) => folder.assets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folder_id' })
  folder: Folder;

  @Column({ name: 'folder_id' })
  folderId: string;

  @Column({ name: 'uploader_id', type: 'uuid' })
  uploaderId: string;

  @Column({ name: 'file_key', type: 'varchar', length: 255 })
  fileKey: string;

  @Column({ name: 'file_type', type: 'varchar', length: 20 })
  fileType: MediaType;

  @Column({ type: 'jsonb', nullable: true })
  metadata: MediaMetadata | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
