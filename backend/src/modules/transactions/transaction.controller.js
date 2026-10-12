import {
  transactionCreateService,
  transactionGetByIdService,
  transactionGetService,
} from './transaction.service.js';

const getCurrentUserId = (request) => {
  return Number(request.user.sub);
};

export const getTransactions = async (request) => {
  const userId = getCurrentUserId(request);

  const transactions = await transactionGetService(userId);

  return {
    data: transactions,
  };
};

export const getTransactionById = async (request) => {
  const userId = getCurrentUserId(request);
  const transactionId = Number(request.params.id);

  const transaction = await transactionGetByIdService(userId, transactionId);

  return {
    data: transaction,
  };
};

export const createTransaction = async (request, reply) => {
  const userId = getCurrentUserId(request);

  const transaction = await transactionCreateService(userId, request.body);

  return reply.code(201).send({
    data: transaction,
  });
};
