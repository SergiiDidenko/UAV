import { readFile } from 'fs/promises';
import { resolve } from 'path';

export default defineEventHandler(async () => {
  try {
    const filePath = resolve('server/flight_data.json');
    const jsonData = await readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return { error: "Ошибка загрузки данных" };
  }
});
