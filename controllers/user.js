const { User } = require("../models/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const postUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const isExists = await User.findOne({
      where: { username },
    });

    if (!isExists) {
      const salt = await bcrypt.genSalt(12);
      const encrypted = await bcrypt.hash(password, salt);
      const username = await User.create({
        username,
        password: encrypted,
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully post user data...",
        data: username,
      });
    } else {
      res.status(409);
      next();
    }
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const isExists = await User.findOne({
      where: { username },
    });

    if (!isExists) {
      res.status(403).send({
        statusCode: res.statusCode,
        msg: "Username atau password salah",
      });
    } else {
      const isValid = await bcrypt.compare(password, isExists.password);
      if (!isValid) {
        res.status(403).send({
          statusCode: res.statusCode,
          msg: "Username atau password salah",
        });
      } else {
        const payload = {
          user: {
            username: isExists.username,
          },
        };
        jwt.sign(
          payload,
          process.env.MY_SECRET_CODE,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({
              statusCode: res.statusCode,
              msg: "Login berhasil",
              token,
            });
          }
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

const getUserLogin = async (req, res, next) => {
  try {
    const data = await User.findOne({
      where: { username: req.user.username },
    });
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get user logged in",
      data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { postUser, userLogin, getUserLogin };
