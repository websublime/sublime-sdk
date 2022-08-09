export type Constructor<Proto = unknown> = new (...arguments_: any[]) => Proto;

export type EssentialSymbol = {
  key: string;
};
