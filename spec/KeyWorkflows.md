A. 高效能上傳 (Presigned URL Pattern)
為了避免大檔案（如 4K 工程錄影）卡死您的後端伺服器，不要讓檔案經過 Backend，而是讓前端直傳 GCS。

前端 (React): 承包商選擇照片，呼叫 API POST /api/upload/sign。

後端 (NestJS): * 驗證 User 是否有該 Project 的「寫入權限」。

向 GCS 申請一個 Signed URL (預簽名網址)，有效期設為 15 分鐘。

回傳 URL 給前端。

前端 (React/Uppy): 使用 PUT 方法將檔案直接傳送到該 URL (直達 GCS bucket)。

前端: 上傳成功後，呼叫 API POST /api/assets 通知後端寫入資料庫 (Metadata)。

B. 縮圖即時生成 (On-the-fly Resizing)
不要在 GCS 存一堆 _thumb.jpg，浪費空間又難管理。使用 Imgproxy。

前端: 請求圖片列表。

後端: 回傳圖片 URL，但不是 GCS 原網址，而是 Imgproxy 網址： https://img.yoursystem.com/rs:fill:300:0/plain/gs://your-bucket/project-a/photo1.jpg

Imgproxy (Cloud Run): * 從 GCS 拉取原圖 (內網傳輸，速度快)。

記憶體中縮圖。

回傳給瀏覽器。

(可選) Cloud CDN 會自動快取這張縮圖，下次讀取連算都不用算。
