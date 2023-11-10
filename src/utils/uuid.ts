export const uuid = (): string =>
  (Math.random() * 36).toString(36).slice(2) + new Date().getTime().toString();
