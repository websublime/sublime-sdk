import { ActionCreatorWithOptionalPayload, AnyAction } from "@reduxjs/toolkit";

export type Class<Proto = unknown> = new (...arguments_: any[]) => Proto;

// eslint-disable-next-line prettier/prettier
export type Abstract<Proto = unknown> = abstract new (...arguments_: any[]) => Proto;

// export type Interface<C extends Class<InstanceType<C>> | Abstract<InstanceType<C>> =

export type Action<T = any> = ActionCreatorWithOptionalPayload<T>;

export type Reducer<State> = (state: State, action: AnyAction) => State | void;

export type Dispatcher = Record<string, (payload?: any) => void>;

export type SymbolID = {
  key: symbol;
};

export type Environment = 'local'|'production'|'development'|'staging'|'test';
