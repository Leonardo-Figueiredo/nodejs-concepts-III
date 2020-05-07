import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);

    const transactions = await transactionRepository.find();

    const incomeTransactions = transactions.map(transaction => {
      return transaction.type === 'income' ? Number(transaction.value) : 0;
    });

    const outcomeTransactions = transactions.map(transaction => {
      return transaction.type === 'outcome' ? Number(transaction.value) : 0;
    });

    const incomeBalance =
      incomeTransactions.length !== 0
        ? incomeTransactions.reduce((total, next) => total + next)
        : 0;

    const outcomeBalance =
      outcomeTransactions.length !== 0
        ? outcomeTransactions.reduce((total, next) => total + next)
        : 0;

    const balance = {
      income: incomeBalance,
      outcome: outcomeBalance,
      total: incomeBalance - outcomeBalance,
    };

    return balance;
  }
}

export default TransactionsRepository;
