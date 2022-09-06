exports.getAllMyPolls = (req, res, next) => {
  res.status(200).json({
    success: true,
    text: "Hello world, i'm not so happy",
  });
};

exports.createPoll = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Poll created",
    id: new Date().toISOString(),
    title: title,
    content: content,
  });
};
