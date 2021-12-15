const { Jenis_Susu } = require("../models/model");

const postJenisSusu = async (req, res, next) => {
  const { jenis_susu } = req.body;
  try {
    const data = await Jenis_Susu.create({
      jenis_susu,
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully create data jenis susu",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAllJenisSusu = async (req, res, next) => {
  try {
    const data = await Jenis_Susu.findAll();
    res.status(200).json({
      statusCode: res.statusCode,
      msg: "Successfully get data jenis susu",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { postJenisSusu, getAllJenisSusu };
