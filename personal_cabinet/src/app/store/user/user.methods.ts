import { patchState, SignalState, WritableStateSource } from "@ngrx/signals";
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { IUserState } from "../models";
import { pipe } from "rxjs";
type UserStoreType = {
    state: IUserState;
    methods: any;
};
export function userMethods() {
    return (store: any) => ({
        setUserInfo(userInfo:any) {
            patchState(store, (state: IUserState) => ({
                ...state, 
                userInfo
            }))
        },
        getArticle: rxMethod<any>(
            pipe(
                tapResponse({
                    next: (store:any) => {
                    //   patchState(store, { data: article });
                    },
                    error: () => {
                    //   patchState(store, { data: articleInitialState.data });
                    },
                  }),
            ),
        )
    })
}