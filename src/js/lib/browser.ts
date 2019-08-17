// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BROWSER = ((this as any).browser as typeof chrome) || chrome;

export { BROWSER };
