import { environment } from "../environments/environment.ts";

export default defineEventHandler(async () => {
  try {
    const response = await fetch(`${environment.apiUrl}/flight_data.json`);
    if (!response.ok) throw new Error();
    const data = await response.json(); // ✅ Теперь это работает корректно!
    return { data };
  } catch (error) {
    return { error };
  }
});
