export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes} | ${day}/${month}/${year}`;
};

export const roundToFirstDecimal = (num: number): number => {
  return Math.round(num * 10) / 10;
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export function formatBirthday(input: string): string {
  let parts;
  if (input.includes("/")) {
    parts = input.split("/");
  } else if (input.includes("-")) {
    parts = input.split("-");
  } else {
    return input;
  }
  return parts.join(" / ");
}

export const formatDateString = (text: string) => {
  // Remove all non-digit characters
  const cleaned = ("" + text).replace(/\D/g, "");

  // Format the string as dd/mm/yyyy
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join("/");
  }
  return text;
};
