// utils/formatTime.ts
export function toCustomFormat(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Ay 0'dan başladığı için 1 ekliyoruz ve 2 karakter olacak şekilde başına 0 ekliyoruz.
  const dd = String(date.getDate()).padStart(2, '0'); // Gün için de 2 karakter olacak şekilde başına 0 ekliyoruz.
  const hh = String(date.getHours()).padStart(2, '0'); // Saat için de aynı işlemi yapıyoruz.
  const min = String(date.getMinutes()).padStart(2, '0'); // Dakika için de aynı işlemi yapıyoruz.
  const ss = String(date.getSeconds()).padStart(2, '0'); // Saniye için de aynı işlemi yapıyoruz.
  const ssssss = String(date.getMilliseconds()).padEnd(6, '0'); // Milisaniye için 6 karakter olacak şekilde sonuna 0 ekliyoruz.
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}.${ssssss}`;
}
