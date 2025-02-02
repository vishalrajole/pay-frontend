export const capitalizedStatus = (text: string) =>
  text?.[0].toUpperCase() + text?.slice(1).toLowerCase() || "";
