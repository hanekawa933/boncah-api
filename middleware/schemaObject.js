const yup = require("yup");
// Hidden for simplicity

const schemaLogin = yup.object({
  body: yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  }),
});

module.exports = {
  schemaLogin,
};
