function emptyToNullTransform(value, ctx) {
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  return value;
}

module.exports = {
  emptyToNullTransform
};
