const Option = require("../models/option");

module.exports = {
  deleteOptionsOnCascade: function (questionId) {
    Option.findAll({
      where: { questionId: questionId, activated: true },
    }).then((options) => {
      options.forEach((option) => {
        option.activated = false;
        option.save();
      });
    });
  },
};
