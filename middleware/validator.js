const yup = require("yup");
// Hidden for simplicity

const { schemaLogin } = require("./schemaObject");

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
    });
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validateSchema };
