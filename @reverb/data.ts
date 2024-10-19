import type { MetaMatches } from "node_modules/react-router/dist/lib/dom/ssr/routeModules";
import type {
    LoaderFunction,
    MetaDescriptor,
    Location,
    LoaderFunctionArgs,
    ActionFunctionArgs,
    LinksFunction,
} from "react-router";

type MaybePromise<T> = T | Promise<T>;

export interface MetaArgs<
    Data = unknown,
    MatchLoaders extends Record<string, LoaderFunction | unknown> = Record<string, unknown>
> {
    data: Data | undefined;
    params: Record<string, string | undefined>;
    location: Location;
    matches: MetaMatches<MatchLoaders>;
    error?: unknown;
}

export interface MetaFunction<
    Data = unknown,
    MatchLoaders extends Record<string, LoaderFunction | unknown> = Record<string, unknown>
> {
    (args: MetaArgs<Data, MatchLoaders>): MaybePromise<MetaDescriptor[] | undefined>;
}

export declare function createLoader<T>(
    loader: (args: LoaderFunctionArgs) => MaybePromise<T>
): () => Promise<T>;
export declare function createAction<T>(
    action: (args: ActionFunctionArgs) => MaybePromise<T>
): (data: FormData) => Promise<T>;
export declare function defineMeta(meta: MetaFunction): MetaFunction;
export declare function defineLinks(meta: LinksFunction): LinksFunction;

export { useSubmit } from "react-router";
