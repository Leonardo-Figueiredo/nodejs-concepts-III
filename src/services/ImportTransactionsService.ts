import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

interface RequestDTO {
  filename: string;
  originalname: string;
}

class ImportTransactionsService {
  async execute({
    filename,
    originalname,
  }: RequestDTO): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, filename);

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', line => {
      console.log(line);
    });
  }
}

export default ImportTransactionsService;
