層級,技術選擇,部署服務 (GCP),選擇理由
Frontend,React + TypeScript + Vite,Cloud Run (Nginx) 或 Firebase Hosting,現代化標準，搭配前述的 react-photo-album 等套件。
Backend,Node.js (NestJS),Cloud Run,強型別、結構嚴謹，適合處理複雜的權限 (RBAC) 邏輯。
Database,PostgreSQL,Cloud SQL,儲存專案結構、相片 Meta 資料、Exif、施工備註的最佳關聯式資料庫。
Storage,Object Storage,Google Cloud Storage (GCS),無限容量，比傳統硬碟便宜，且高可用性。
Processing,Imgproxy,Cloud Run,Go 語言編寫的高效能圖片縮放服務，負責即時生成縮圖，節省流量。
Auth,OIDC / OAuth2,(外部或自建),與既有平台的 SSO 整合。
