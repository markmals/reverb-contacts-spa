import { use, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useNavigation } from "@reverb/router";
import { createAction, createLoader, useSubmit } from "@reverb/data";
import { contacts } from "~/lib/contacts.server";
import clsx from "clsx";

export const getContacts = createLoader(async ({ request }) => {
    "use server";
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? undefined;
    return { allContacts: await contacts.getAll(query), q: query };
});

const createContact = createAction(async () => {
    "use server";
    const contact = await contacts.create();
    throw Response.redirect(`/contact/${contact.id}`);
});

export default function Route() {
    const { allContacts, q } = use(getContacts());

    const navigation = useNavigation();
    const navigate = useNavigate();
    const submit = useSubmit();

    const searching = !!q;

    useEffect(() => {
        if (document) {
            document.querySelector<HTMLInputElement>("#q")!.value = q ?? "";
        }
    }, [q]);

    return (
        <div id="root">
            <div id="sidebar">
                <h1>Reverb Contacts</h1>
                <div>
                    <form id="search-form" role="search" method="get">
                        <input
                            aria-label="Search contacts"
                            className={searching ? "loading" : ""}
                            value={q}
                            id="q"
                            name="q"
                            onChange={event => {
                                // Remove empty query params when value is empty
                                if (!event.currentTarget) {
                                    navigate("/");
                                    return;
                                }

                                // This will perform a GET CSR navigation to the same URL with
                                // the query params from the serialized form (e.g. /?q=foo)
                                const isFirstSearch = q === null;
                                submit(event.currentTarget.form, { replace: !isFirstSearch });
                            }}
                            placeholder="Search"
                            type="search"
                        />
                        <div aria-hidden hidden={!searching} id="search-spinner" />
                        <div aria-live="polite" className="sr-only"></div>
                    </form>
                    <form action={createContact}>
                        <button type="submit">New</button>
                    </form>
                </div>
                <nav>
                    {!!allContacts.length ? (
                        <ul>
                            {allContacts.map(contact => (
                                <li>
                                    <NavLink
                                        className={({ isActive, isPending }) =>
                                            isActive ? "active" : isPending ? "pending" : ""
                                        }
                                        to={`contact/${contact.id}`}
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div className={clsx({ loading: navigation.state === "loading" })} id="detail">
                <Outlet />
            </div>
        </div>
    );
}
