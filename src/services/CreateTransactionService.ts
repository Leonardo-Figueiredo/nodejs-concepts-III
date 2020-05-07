import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome')
      throw new AppError('Invalid transaction type.');

    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total < value)
      throw new AppError('You have no balance for this transaction.', 403);

    const categoryExists = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (categoryExists) {
      const transaction = transactionRepository.create(({
        title,
        value,
        type,
        category_id: categoryExists.id,
      } as unknown) as Transaction);
      await transactionRepository.save(transaction);

      return transaction;
    }

    const newCategory = categoryRepository.create({
      title: category,
    });
    await categoryRepository.save(newCategory);

    const transaction = transactionRepository.create(({
      title,
      value,
      type,
      category_id: newCategory.id,
    } as unknown) as Transaction);
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
