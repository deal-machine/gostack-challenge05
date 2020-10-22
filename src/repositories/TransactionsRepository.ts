import Transaction from '../models/Transaction';

interface CreateTransactionsDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((prev, elem) => prev + elem.value, 0);

    const outcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((prev, elem) => prev + elem.value, 0);

    const total = income - outcome;

    const balance = { income, outcome, total };
    return balance;
  }

  public create({ title, value, type }: CreateTransactionsDTO): Transaction {
    const { total } = this.getBalance();

    if (type === 'outcome' && value > total) {
      throw Error(`Invalid value, your balance is ${total}`);
    } else {
      const transaction = new Transaction({ title, value, type });
      this.transactions.push(transaction);
      return transaction;
    }
  }
}

export default TransactionsRepository;
