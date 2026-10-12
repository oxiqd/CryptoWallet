export const parseListEnv = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  return value.split(',').map((item) => item.trim());
};
