import { Usuario } from "./schema";

export type TupleResponse<T, E = Error> = [ T, null ] | [ null, E ];

export type UseTuple = <T, E = Error>(promise: Promise<T>) => Promise<TupleResponse<T, E>>