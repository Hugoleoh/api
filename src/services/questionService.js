const Question = require("../models/question");
const OptionService = require("../services/optionService");

module.exports = {
  deleteQuestionsOnCascade: function (pollId) {
    Question.findAll({
      where: { pollId: pollId, activated: true },
    }).then((questions) => {
      questions.forEach((question) => {
        try {
          OptionService.deleteOptionsOnCascade(question.id);
        } catch (err) {
          const error = new Error("Could not delete this question options");
          error.statusCode = 400;
          throw error;
        }
        question.activated = false;
        question.save();
      });
    });
  },
};
