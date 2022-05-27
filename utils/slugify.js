const slugify = (string) => {
  return string.toString().trim().toLowerCase();
};

module.exports = { slugify };
