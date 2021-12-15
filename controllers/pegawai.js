const { Pegawai, Data_Diri, Agama, Job } = require("../models/model");

const postDataPegawai = async (req, res) => {
  const {
    nama_lengkap,
    alamat,
    pekerjaan,
    tempat,
    tanggal_lahir,
    agama_id,
    username,
    email,
    password,
    no_telp,
    status,
    job_id,
  } = req.body;

  try {
    const checkUsername = await Pegawai.findOne({ where: { username } });
    const checkEmail = await Pegawai.findOne({ where: { email } });

    if (!checkUsername && !checkEmail) {
      const dataDiri = await Data_Diri.create({
        nama_lengkap,
        alamat,
        pekerjaan,
        tempat,
        tanggal_lahir,
        agama_id,
      });

      const dataDiriID = dataDiri.getDataValue("id");

      const pegawai = await Pegawai.create({
        username,
        password,
        email,
        no_telp,
        status,
        job_id,
        data_diri_id: dataDiriID,
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Pegawai Successfully created...",
        data: [dataDiri, pegawai],
      });
    } else {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Username already exists...",
      });
    }
  } catch (error) {
    res.status(500).send({
      statusCode: res.statusCode,
      msg: "Something went wrong...",
      errorMsg: error.message,
      stack: error,
    });
  }
};

module.exports = {
  postDataPegawai,
};
