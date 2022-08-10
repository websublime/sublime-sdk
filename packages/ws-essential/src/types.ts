import { AnyAction } from '@reduxjs/toolkit';

type Actions = {
  action: AnyAction;
  reducer: <State, Action>(state: State, argument: Action) => AnyAction;
};

export interface Essential<State, Dispatchers> {
  symbol: SymbolID;

  readonly initial: State;

  readonly dispatchers: Dispatchers;

  readonly actions: Array<Actions>;

  dispatch(action: AnyAction): AnyAction;
}

export type Class<Proto = unknown> = new (...arguments_: any[]) => Proto;

// eslint-disable-next-line prettier/prettier
export type Abstract<Proto = unknown> = abstract new (...arguments_: any[]) => Proto;

// export type Interface<C extends Class<InstanceType<C>> | Abstract<InstanceType<C>> =

export type Link<T = Class> = T extends Essential<unknown, unknown>
  ? T
  : unknown;

export type SymbolID = {
  key: symbol;
};
