// import { type Action } from "redux";

import type { store } from './store'

export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;
export type AppDispatch = typeof store.dispatch;
// export type PayloadAction<T extends string, P extends Record<string, unknown>> = Action<T> & { payload: P };
