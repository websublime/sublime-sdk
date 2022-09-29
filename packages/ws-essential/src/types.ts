// eslint-disable-next-line prettier/prettier
import type { AnyAction } from '@reduxjs/toolkit';

/**
 * Sicle namespace identifier
 * @public
 */
export type SymbolID = {
  key: symbol;
};

export type AnyState<S = any> = S extends Record<string, any> ? S : any;

export type Class<Proto = unknown> = new (...arguments_: any[]) => Proto;

// eslint-disable-next-line prettier/prettier
export type Abstract<Proto = unknown> = abstract new (...arguments_: any[]) => Proto;

export type ReducerFunction = <T extends { type: string; payload: any }>(
  state: any,
  action: T
) => void;

export type LinkSubscriptions = Array<{
  callback: (state: AnyState, action: AnyAction) => void;
  priority: number;
  once: boolean;
  id: string;
}>;

export type LinkPipes = {
  callback: (results: Record<keyof Omit<LinkPipes, 'callback'>, any>) => void;
  [key: string]: (state: AnyState) => unknown;
};

export type LinkUnsubscribe = () => void;

export type LinkEntries<T extends Essential<AnyState>> = {
  link: InstanceType<Class<T>>;
};

/**
 * Essential signature implementation
 * @public
 */
export interface Essential<State> {
  namespace: SymbolID;
  //readonly dispatchers: unknown;
  readonly initialState: State;
  readonly reducer: any;
  onChange?: (oldState: State, newState: State, action: AnyAction) => void;
}

export const EssentialStorage = {
  LOCAL: 'localStorage',
  MEMORY: 'memory',
  SESSION: 'session'
} as const;

type EssentialStorageKey = keyof typeof EssentialStorage;

export type EssentialStorageType = typeof EssentialStorage[EssentialStorageKey];
