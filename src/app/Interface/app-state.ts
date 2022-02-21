// 所有的state

import { DataState } from "../enum/data.state.enum";

export interface AppState<T> {
    dataState: DataState;
    // 不会同时返回
    appData?: T;
    error?: string;
}