import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import mongoose from "mongoose"; // Thư viện kết nối DB

/**
 * Import các phòng game
 */
import { MyRoom } from "./rooms/MyRoom";

export default config({

    initializeGameServer: async (gameServer) => {
        /**
         * 1. LẤY CHUỖI KẾT NỐI TỪ CẤU HÌNH (Sẽ cài trên web sau)
         */
        const MONGO_URI = process.env.MONGO_URI;

        // 2. TIẾN HÀNH KẾT NỐI
        if (!MONGO_URI) {
            console.warn("⚠️ CẢNH BÁO: Chưa có biến MONGO_URI.");
        } else {
            try {
                await mongoose.connect(MONGO_URI);
                console.log("✅ KẾT NỐI DATABASE THÀNH CÔNG!");
            } catch (e) {
                console.error("❌ Lỗi kết nối:", e);
            }
        }

        /**
         * 3. ĐỊNH NGHĨA PHÒNG GAME
         */
        gameServer.define('my_room', MyRoom);
    },

    initializeExpress: (app) => {
        /**
         * Tạo đường dẫn để xem Dashboard quản lý
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }

        app.use("/colyseus", monitor());
    }
});
