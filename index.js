const express = require("express");
const app = express();
const { connection } = require("./db/connection");
const helmet = require("helmet");
const morgan = require("morgan");
const produksi_susu = require("./routes/api/produksi_susu");
const produksi_pupuk = require("./routes/api/produksi_pupuk");
const pegawai = require("./routes/api/pegawai");
const pinjaman = require("./routes/api/pinjaman");
const gaji = require("./routes/api/gaji");
const penjualan_susu = require("./routes/api/penjualan_susu");
const penjualan_pupuk = require("./routes/api/penjualan_pupuk");
const jenis_susu = require("./routes/api/jenis_susu");
const kambing = require("./routes/api/kambing");
const kandang_kambing = require("./routes/api/kandang_kambing");
const hasil_perahan = require("./routes/api/hasil_perahan");
const susu = require("./routes/api/susu");
const pupuk = require("./routes/api/pupuk");
const penjualan = require("./routes/api/penjualan");
const user = require("./routes/api/user");
const pengeluaran = require("./routes/api/pengeluaran");

const { notFound, errorHandlers } = require("./middleware/errorMessage");

app.use(morgan("tiny"));
app.use(helmet());
app.use(express.json());

connection();

app.use("/api/v1/produksi_susu", produksi_susu);
app.use("/api/v1/produksi_pupuk", produksi_pupuk);
app.use("/api/v1/jenis_susu", jenis_susu);
app.use("/api/v1/pegawai", pegawai);
app.use("/api/v1/pinjaman", pinjaman);
app.use("/api/v1/gaji", gaji);
app.use("/api/v1/penjualan_susu", penjualan_susu);
app.use("/api/v1/penjualan_pupuk", penjualan_pupuk);
app.use("/api/v1/kambing", kambing);
app.use("/api/v1/kandang_kambing", kandang_kambing);
app.use("/api/v1/hasil_perahan", hasil_perahan);
app.use("/api/v1/susu", susu);
app.use("/api/v1/pupuk", pupuk);
app.use("/api/v1/penjualan", penjualan);
app.use("/api/v1/user", user);
app.use("/api/v1/pengeluaran", pengeluaran);

app.use(notFound);
app.use(errorHandlers);

const port = process.env.PORT || 8000;
console.log(port);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
