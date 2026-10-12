export const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const parseListEnv = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  return value.split(',').map((item) => item.trim());
};
