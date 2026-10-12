export const getTransactionByIdSchema = {
  params: {
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: {
        type: 'string',
        pattern: '^[1-9][0-9]*$',
      },
    },
  },
};

export const createTransactionSchema = {
  body: {
    type: 'object',
    required: ['type', 'asset', 'amount'],
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        enum: ['deposit', 'withdrawal'],
      },
      asset: {
        type: 'string',
        enum: ['BTC', 'ETH', 'USDT'],
      },
      amount: {
        type: 'number',
        exclusiveMinimum: 0,
      },
    },
  },
};
