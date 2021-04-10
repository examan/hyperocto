// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BROWSER = ((this as any).browser as typeof chrome) ?? chrome;
