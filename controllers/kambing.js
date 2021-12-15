const {
  Kambing,
  Kandang_Kambing,
  Jenis_Kambing,
  Status_Kambing,
  Kandang,
} = require("../models/model");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postKambing = async (req, res, next) => {
  const { jenis_kambing_id, status_kambing_id, kandang_kambing_id } = req.body;

  const pad = (string, range, padBy) => {
    String(string).padStart(range, padBy); // '0009'
  };

  try {
    const count = await Kambing.count({ where: { jenis_kambing_id } });
    const kandang_kambing = await Kandang_Kambing.findOne({
      where: { kandang_id: kandang_kambing_id },
      include: [{ model: Kandang }],
    });

    const update =
      jenis_kambing_id === 1
        ? {
            jumlah_kambing: kandang_kambing.jumlah_kambing + 1,
            betina: kandang_kambing.betina + 1,
          }
        : jenis_kambing_id === 2
        ? {
            jumlah_kambing: kandang_kambing.jumlah_kambing + 1,
            jantan: kandang_kambing.jantan + 1,
          }
        : {
            jumlah_kambing: kandang_kambing.jumlah_kambing + 1,
            anakan: kandang_kambing.anakan + 1,
          };

    const {
      kandang: { kandang },
    } = kandang_kambing;

    const no_kambing = `${kandang}${count.toString().padStart(4, "0")}`;
    const data = await Kambing.create({
      no_kambing,
      jenis_kambing_id,
      foto: "/images/" + req.file.filename,
      status_kambing_id,
      kandang_kambing_id,
    });

    const dataKandang = await Kandang_Kambing.update(update, {
      where: { kandang_id: kandang_kambing_id },
    });
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully post data kambing",
      data,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getAllKambing = async (req, res, next) => {
  try {
    const data = await Kambing.findAll();

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data kambing",
      data,
    });
  } catch (error) {
    error(next);
  }
};

const getKambingById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Kambing.findOne({ where: { id } });
    if (data) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data kambing",
        data,
      });
    } else {
      res.status(404);
      next();
    }
  } catch (error) {
    next(error);
  }
};

const getAllKambingNeeds = async (req, res, next) => {
  try {
    const jenis_kambing = await Jenis_Kambing.findAll();
    const status_kambing = await Status_Kambing.findAll();
    const kandang_kambing = await Kandang.findAll();
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully fetch jenis kambing",
      data: {
        jenis_kambing,
        status_kambing,
        kandang_kambing,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postKambing,
  getAllKambing,
  getKambingById,
  getAllKambingNeeds,
};
