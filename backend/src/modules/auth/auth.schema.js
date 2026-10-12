export const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
      email: {
        type: 'string',
        minLength: 5,
        maxLength: 254,
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 72,
      },
    },
  },
};

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
      email: {
        type: 'string',
        minLength: 5,
        maxLength: 254,
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 72,
      },
    },
  },
};
