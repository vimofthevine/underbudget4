export default (args) => {
  if (args) {
    if (Array.isArray(args)) {
      return [...args];
    }
    return [args];
  }
  return [];
};
