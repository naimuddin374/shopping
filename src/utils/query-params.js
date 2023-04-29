exports.getQueryParams = (req) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");
  const keyword = req.query.keyword ?? "";

  return {
    page,
    limit,
    keyword,
  };
};
