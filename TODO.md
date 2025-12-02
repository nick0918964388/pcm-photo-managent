# PCM Photo Management - 開發進度追蹤

## Phase 0: 專案初始化 ✅
- [x] 建立 NestJS 後端專案
- [x] 安裝後端核心依賴 (TypeORM, pg, config, validator, minio)
- [x] 配置環境變數與資料庫連線
- [x] 建立資料庫 Entities (Project, Folder, MediaAsset)
- [x] 建立 React + Vite 前端專案
- [x] 安裝前端核心依賴 (router, query, tailwind, react-photo-album)

## Phase 1: MVP 核心功能

### Phase 1.1: 專案管理模組 ✅
- [x] 後端 API (TDD) - 16 tests passing
  - GET /api/projects
  - GET /api/projects/:id
  - POST /api/projects
  - PATCH /api/projects/:id
  - DELETE /api/projects/:id
- [x] 前端頁面
  - ProjectListPage
  - ProjectCard
  - CreateProjectModal

### Phase 1.2: 資料夾管理模組 ✅
- [x] 後端 API (TDD) - 11 tests passing
  - GET /api/projects/:projectId/folders
  - POST /api/projects/:projectId/folders
  - GET /api/folders/:id
  - GET /api/folders/:id/breadcrumb
  - PATCH /api/folders/:id
  - DELETE /api/folders/:id
- [x] 前端頁面
  - FolderBrowserPage
  - FolderCard
  - Breadcrumb
  - CreateFolderModal

### Phase 1.3: 檔案上傳模組 (Presigned URL) 🔄 進行中
- [ ] 後端 Storage Service (MinIO 整合)
- [ ] 後端 Upload API
  - POST /api/upload/sign - 取得預簽名 URL
- [ ] 後端 Assets API
  - POST /api/assets - 註冊上傳完成的檔案
  - GET /api/folders/:folderId/assets
  - GET /api/assets/:id
  - DELETE /api/assets/:id
- [ ] 前端上傳元件
  - FileUploader (拖放上傳)
  - UploadProgressList

### Phase 1.4: 相片瀏覽模組 (Imgproxy 縮圖) ⏳ 待開發
- [ ] 後端 Imgproxy Service (URL 簽名生成)
- [ ] 前端相片展示 (使用 react-photo-album)
  - PhotoGrid
  - PhotoLightbox (yet-another-react-lightbox)
  - PhotoDetailPanel

## Phase 2: 認證與權限 ⏳ 待開發

### Phase 2.1: 認證模組 (SSO)
- [ ] 後端 AuthProvider 介面設計
- [ ] MockAuthProvider (開發環境)
- [ ] OIDCAuthProvider (預留 SSO 整合)
- [ ] 前端 AuthProvider + ProtectedRoute

### Phase 2.2: 專案權限控制
- [ ] User, ProjectPermission Entities
- [ ] ProjectPermissionGuard
- [ ] 權限管理 API

## Phase 3: 進階功能 ⏳ 待規劃
- [ ] 批次下載 (zip)
- [ ] 搜尋功能
- [ ] 標籤系統
- [ ] 施工備註
- [ ] 影片支援
- [ ] EXIF/GPS 解析
