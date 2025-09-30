import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const url = "https://gb-8e4c1-default-rtdb.firebaseio.com/taixiu_sessions.json";

let latestPhien = null;
let latestData = null;

async function checkSession() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data) {
      const sessions = Object.values(data).filter(x => x.Phien !== undefined);

      if (sessions.length > 0) {
        const latestSession = sessions.reduce((a, b) =>
          a.Phien > b.Phien ? a : b
        );

        if (latestPhien === null || latestSession.Phien > latestPhien) {
          latestPhien = latestSession.Phien;
          latestData = latestSession;

          console.log("Phiên mới:", latestSession.Phien);
          console.log("Kết quả:", latestSession.ket_qua);
          console.log("Tổng:", latestSession.tong);
          console.log(
            "Xúc xắc:",
            latestSession.xuc_xac_1,
            latestSession.xuc_xac_2,
            latestSession.xuc_xac_3
          );
          console.log("-------------------------------");
        }
      }
    }
  } catch (err) {
    console.error("Lỗi:", err.message);
  }
}

// check session mỗi 3 giây
setInterval(checkSession, 3000);
checkSession();

// API endpoint: luôn trả về dữ liệu mới nhất hiện có
app.get("/api/taixiu", (req, res) => {
  if (latestData) {
    res.json({
      Phien: latestData.Phien,
      Xuc_xac_1: latestData.xuc_xac_1,
      Xuc_xac_2: latestData.xuc_xac_2,
      Xuc_xac_3: latestData.xuc_xac_3,
      Tong: latestData.tong,
      Ket_qua: latestData.ket_qua,
      Phien_hien_tai: latestData.Phien + 1,
      id: "Cstooldudoan11"
    });
  } else {
    res.json({ message: "Chưa có dữ liệu" });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
