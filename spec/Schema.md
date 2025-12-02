-- 專案表 (權限控制的根基)
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    code VARCHAR(50) UNIQUE, -- 專案編號
    name VARCHAR(255),
    status VARCHAR(20) -- 進行中/結案
);

-- 資料夾/節點表 (實現無限層級)
CREATE TABLE folders (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    parent_id UUID REFERENCES folders(id), -- 支援巢狀結構
    name VARCHAR(255), -- 例如: "2023-12-01", "機房施工"
    path_string TEXT -- 輔助查詢用，例如 "/ProjA/2023/12/"
);

-- 相片/影片檔案表
CREATE TABLE media_assets (
    id UUID PRIMARY KEY,
    folder_id UUID REFERENCES folders(id),
    uploader_id UUID, -- 記錄是哪個承包商傳的
    file_key VARCHAR(255), -- 對應 GCS 的儲存路徑
    file_type VARCHAR(20), -- 'image' or 'video'
    metadata JSONB, -- 儲存 Exif, 拍攝設備, GPS 座標
    created_at TIMESTAMP DEFAULT NOW()
);
