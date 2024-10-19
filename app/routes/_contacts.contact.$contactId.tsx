import { use, useEffect, useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import { createLoader, createAction, defineMeta } from "@reverb/data";
import { deleteContact, getContact, updateContact } from "~/lib/contacts.server";

export const loadContact = createLoader(async ({ params }) => {
    "use server";
    const contact = await getContact(parseInt(params.contactId!));

    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }

    return contact;
});

export const favoriteAction = createAction(async ({ params, request }) => {
    "use server";
    const data = await request.formData();
    return await updateContact(parseInt(params.contactId!), {
        favorite: data.get("favorite") === "true",
    });
});

export const deleteAction = createAction(async ({ request }) => {
    "use server";
    const data = await request.formData();
    await deleteContact(parseInt(data.get("id") as string));
    throw Response.redirect("/");
});

export const meta = defineMeta(async () => {
    const contact = await loadContact();
    return [{ title: `${contact.first} ${contact.last} | Reverb Contacts` }];
});

export default function Route() {
    const contact = use(loadContact());
    const hasAvatar = !!contact.avatar;

    return (
        <div id="contact">
            <div>
                <img
                    alt=""
                    src={
                        hasAvatar
                            ? contact.avatar
                            : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    }
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}
                    <Favorite id={contact.id} favorite={contact.favorite!} />
                </h1>

                {contact.mastodon && (
                    <p>
                        <a
                            href={`https://mastodon.social/${contact.mastodon.replace(
                                "@mastodon.social",
                                ""
                            )}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {contact.mastodon}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <form action="edit" method="get">
                        <button type="submit">Edit</button>
                    </form>
                    <form
                        action={deleteAction}
                        onSubmit={event => {
                            if (!confirm("Please confirm you want to delete this record.")) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <input type="hidden" name="id" value={contact.id} />
                        <button type="submit">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function Favorite({ id, favorite: initialFavorite }: { id: number; favorite: boolean }) {
    const { data } = useFormStatus();
    const [favorite, setFavorite] = useOptimistic(initialFavorite);

    useEffect(() => {
        if (data) setFavorite(data.get("favorite") === "true");
    }, [data]);

    return (
        <form action={favoriteAction}>
            <input type="hidden" name="id" value={id} />
            <button
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                name="favorite"
                value={favorite ? "false" : "true"}
            >
                {favorite ? "★" : "☆"}
            </button>
        </form>
    );
}
