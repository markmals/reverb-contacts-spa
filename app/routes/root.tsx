import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@reverb/router";
import { defineLinks, defineMeta } from "@reverb/data";
import styles from "./index.css?url";

export const meta = defineMeta(() => [
    { charSet: "utf-8" },
    { title: "Reverb Contacts" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
]);

export const links = defineLinks(() => [
    { rel: "stylesheet", href: styles },
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
]);

export default function Route() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
