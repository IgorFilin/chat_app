import { patchState, SignalState, WritableStateSource } from "@ngrx/signals";
import { IUserState } from "../models";
type UserStoreType = {
    state: IUserState;
    methods: any;
};
export function userMethods() {
    return (store: any) => ({
        updateId(query: string): void {
            patchState(store, (state: IUserState) => ({
                ...state,
                id: query,
            }));
        },
    })
}