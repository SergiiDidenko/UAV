import { environment } from "../environments/environment.ts";

export default defineEventHandler(async () => {
  try {
    const response = await fetch(`${environment.apiUrl}/flight_data.json`);
    if (!response.ok) throw new Error("Ошибка загрузки JSON");
    return await response.json();
  } catch (error) {
    return { error };
  }
});
