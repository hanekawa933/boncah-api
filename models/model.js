const Agama = require("./agama");
const Catatan_Kambing = require("./catatan_kambing");
const Data_Diri = require("./data_diri");
const Gaji = require("./gaji");
const Harga_Pupuk = require("./harga_pupuk");
const Hasil_Perahan = require("./hasil_perahan");
const Harga_Susu = require("./harga_susu");
const Jenis_Kambing = require("./jenis_kambing");
const Jenis_Susu = require("./jenis_susu");
const Job = require("./job");
const Kambing = require("./kambing");
const Kandang_Kambing = require("./kandang_kambing");
const Pegawai = require("./pegawai");
const Pengeluaran = require("./pengeluaran");
const Penghasilan = require("./penghasilan");
const Penghasilan_Harian = require("./penghasilan_harian");
const Penjualan_Susu = require("./penjualan_susu");
const Penjualan_Pupuk = require("./penjualan_pupuk");
const Pinjaman = require("./pinjaman");
const Pinjaman_Bulanan = require("./pinjaman_bulanan");
const Produksi_Pupuk = require("./produksi_pupuk");
const Status_Kambing = require("./status_kambing");
const Stock_Pupuk = require("./stock_pupuk");
const Stock_Produksi_Susu = require("./stock_produksi_susu");
const Produksi_Susu = require("./produksi_susu");
const Keterangan_Pemerahan = require("./keterangan_pemerahan");
const Waktu_Pemerahan = require("./waktu_pemerahan");
const Kandang = require("./kandang");
const User = require("./user");
const Kategori_Pengeluaran = require("./kategori_pengeluaran");

Jenis_Susu.hasMany(Produksi_Susu, {
  foreignKey: "jenis_susu_id",
});

Produksi_Susu.belongsTo(Jenis_Susu, {
  foreignKey: "jenis_susu_id",
});

Jenis_Susu.hasOne(Harga_Susu, {
  foreignKey: "jenis_susu_id",
});

Harga_Susu.belongsTo(Jenis_Susu, {
  foreignKey: "jenis_susu_id",
});

Jenis_Susu.hasMany(Penjualan_Susu, {
  foreignKey: "jenis_susu_id",
});

Penjualan_Susu.belongsTo(Jenis_Susu, {
  foreignKey: "jenis_susu_id",
});

Jenis_Susu.hasMany(Stock_Produksi_Susu, {
  foreignKey: "jenis_susu_id",
});

Stock_Produksi_Susu.belongsTo(Jenis_Susu, {
  foreignKey: "jenis_susu_id",
});

Data_Diri.belongsTo(Agama, {
  foreignKey: "agama_id",
});

Agama.hasMany(Data_Diri, {
  foreignKey: "agama_id",
});

Gaji.belongsTo(Pinjaman_Bulanan, {
  foreignKey: "pinjaman_bulanan_id",
});

Gaji.belongsTo(Pegawai, {
  foreignKey: "pegawai_id",
});

Pinjaman_Bulanan.belongsTo(Pegawai, {
  foreignKey: "pegawai_id",
});

Pinjaman_Bulanan.hasMany(Gaji, {
  foreignKey: "pinjaman_bulanan_id",
});

Pinjaman.belongsTo(Pegawai, {
  foreignKey: "pegawai_id",
});

Job.hasMany(Pegawai, {
  foreignKey: "job_id",
});

Pegawai.belongsTo(Job, {
  foreignKey: "job_id",
});

Pegawai.belongsTo(Data_Diri, {
  foreignKey: "data_diri_id",
});

Pegawai.hasMany(Pinjaman, {
  foreignKey: "pegawai_id",
});

Pegawai.hasMany(Pinjaman_Bulanan, {
  foreignKey: "pegawai_id",
});

Pegawai.hasMany(Gaji, {
  foreignKey: "pegawai_id",
});

// Jenis_Kambing.hasMany(Catatan_Kambing, {
//   foreignKey: "jenis_kambing_id",
// });

// Catatan_Kambing.belongsTo(Jenis_Kambing, {
//   foreignKey: "jenis_kambing_id",
// });

Status_Kambing.hasMany(Kandang_Kambing, {
  foreignKey: "status_kambing_id",
});

Kandang_Kambing.belongsTo(Status_Kambing, {
  foreignKey: "status_kambing_id",
});

Kandang.hasMany(Kandang_Kambing, {
  foreignKey: "kandang_id",
});

Kandang_Kambing.belongsTo(Kandang, {
  foreignKey: "kandang_id",
});

Jenis_Kambing.hasOne(Kambing, {
  foreignKey: "jenis_kambing_id",
});

Kambing.belongsTo(Jenis_Kambing, {
  foreignKey: "jenis_kambing_id",
});

Status_Kambing.hasMany(Kambing, {
  foreignKey: "status_kambing_id",
});

Kambing.belongsTo(Status_Kambing, {
  foreignKey: "status_kambing_id",
});

Kandang_Kambing.hasMany(Kambing, {
  foreignKey: "kandang_kambing_id",
});

Kambing.belongsTo(Kandang_Kambing, {
  foreignKey: "kandang_kambing_id",
});

// Jenis_Susu.hasMany(Hasil_Perahan, {
//   foreignKey: "jenis_susu_id",
// });

// Hasil_Perahan.belongsTo(Jenis_Susu, {
//   foreignKey: "jenis_susu_id",
// });

Keterangan_Pemerahan.hasMany(Hasil_Perahan, {
  foreignKey: "keterangan_pemerahan_id",
});

Hasil_Perahan.belongsTo(Keterangan_Pemerahan, {
  foreignKey: "keterangan_pemerahan_id",
});

Waktu_Pemerahan.hasMany(Hasil_Perahan, {
  foreignKey: "waktu_pemerahan_id",
});

Hasil_Perahan.belongsTo(Waktu_Pemerahan, {
  foreignKey: "waktu_pemerahan_id",
});

Kandang.hasMany(Kandang_Kambing, {
  foreignKey: "kandang_id",
});

Kandang_Kambing.belongsTo(Kandang, {
  foreignKey: "kandang_id",
});

Kategori_Pengeluaran.hasMany(Pengeluaran, {
  foreignKey: "kategori_pengeluaran_id",
});

Pengeluaran.belongsTo(Kategori_Pengeluaran, {
  foreignKey: "kategori_pengeluaran_id",
});

module.exports = {
  Harga_Susu,
  Jenis_Susu,
  Kambing,
  Pegawai,
  Pengeluaran,
  Penghasilan,
  Penjualan_Susu,
  Stock_Produksi_Susu,
  Produksi_Susu,
  Job,
  Gaji,
  Pegawai,
  Pinjaman,
  Pinjaman_Bulanan,
  Data_Diri,
  Agama,
  Catatan_Kambing,
  Harga_Pupuk,
  Jenis_Kambing,
  Kandang_Kambing,
  Penghasilan_Harian,
  Penjualan_Pupuk,
  Produksi_Pupuk,
  Status_Kambing,
  Stock_Pupuk,
  Waktu_Pemerahan,
  Hasil_Perahan,
  Keterangan_Pemerahan,
  User,
  Kandang,
  Kategori_Pengeluaran,
};
