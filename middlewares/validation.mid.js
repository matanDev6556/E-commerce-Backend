const { validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errosMsgs = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      }));
      console.log(errosMsgs);
      return res.status(400).json({ errors: errosMsgs });
    }

    next();
  };
};
