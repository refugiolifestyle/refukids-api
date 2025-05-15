import { TupleResponse, UseTuple } from "@/types/core";

export const useTuple: UseTuple = async <T, E = Error>(promise: Promise<T>): Promise<TupleResponse<T, E>> => {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error as E];
    }
};