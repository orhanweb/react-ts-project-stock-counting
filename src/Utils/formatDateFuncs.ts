// utils/formatTime.ts

//Incoming format classic Date Object, Example output format => 2024-03-15 10:30:00
export function formatDateV1(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const ssssss = String(date.getMilliseconds()).padEnd(6, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}.${ssssss}`;
}

// Incoming format => 2024-03-15 10:30:00 : string, Example output format => 09:00 14/03/24
export function formatDateV2(dateStr: string): string {
  const date = new Date(dateStr.replace(" ", "T") + "Z"); // Convert date string to ISO 8601 format and convert to UTC
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Since getMonth starts at 0, we add 1.
  const year = date.getUTCFullYear().toString().slice(2); // Get the last two digits of the year

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

// Opposite of formatDateV1 function
export function convertStringToDate(dateStr: string): Date {
  return new Date(dateStr.replace(" ", "T") + "Z");
}

// Incoming format => 2024-03-15: string, Example output format => 14/03/24
export function formatDateV3(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() starts at 0, it is necessary to add 1.
  const year = date.getFullYear().toString().slice(2); // Gets the last two digits of the year.
  return `${day}/${month}/${year}`;
}
