import { ActionCreatorWithOptionalPayload } from "@reduxjs/toolkit";

export type Class<Proto = unknown> = new (...arguments_: any[]) => Proto;

// eslint-disable-next-line prettier/prettier
export type Abstract<Proto = unknown> = abstract new (...arguments_: any[]) => Proto;

// export type Interface<C extends Class<InstanceType<C>> | Abstract<InstanceType<C>> =

export type Action<T = any> = ActionCreatorWithOptionalPayload<T | undefined>;

export type SymbolID = {
  key: symbol;
};
