import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Response<T> = [Promise<T>, Dispatch<SetStateAction<Promise<T>>>]

export function usePersistedState<T>(key: string, inititialState: T): Response<T> {
    const [state, setState] = useState(async () => {
        const storageValue = await AsyncStorage.getItem(key)

        if (storageValue) {
            return JSON.parse(storageValue)
        } else {        
            return inititialState
        }
    })

    useEffect(() => {
        async () => {
            await AsyncStorage.setItem(key, JSON.stringify(state))
        }
    }, [key, state])
    
    return [state, setState]
}