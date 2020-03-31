exports.respondWithError = (res, errorMsg) => {
  res.status(400);
  res.json({ error: errorMsg });
};

exports.respondNotFound = res => {
  res.status(404);
  res.send('Not found');
};
