import { use, useEffect, useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import { createLoader, createAction, defineMeta } from "@reverb/data";
import { contacts } from "~/lib/contacts.server";

export const getContact = createLoader(async ({ params }) => {
    "use server";
    const contact = await contacts.get(parseInt(params.contactId!));

    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }

    return contact;
});

export const favoriteContact = createAction(async ({ params, request }) => {
    "use server";
    const data = await request.formData();
    return await contacts.update(parseInt(params.contactId!), {
        favorite: data.get("favorite") === "true",
    });
});

export const deleteContact = createAction(async ({ params }) => {
    "use server";
    await contacts.del(parseInt(params.contactId!));
    throw Response.redirect("/");
});

export const meta = defineMeta(async () => {
    const contact = await getContact();
    return [{ title: `${contact.first} ${contact.last} | Reverb Contacts` }];
});

export default function Route() {
    const contact = use(getContact());
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
                    <form action={favoriteContact}>
                        <FavoriteButton favorite={contact.favorite!} />
                    </form>
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
                        action={deleteContact}
                        onSubmit={event => {
                            if (!confirm("Please confirm you want to delete this record.")) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function FavoriteButton({ favorite: initialFavorite }: { favorite: boolean }) {
    const { data } = useFormStatus();
    const [favorite, setFavorite] = useOptimistic(initialFavorite);

    useEffect(() => {
        if (data) setFavorite(data.get("favorite") === "true");
    }, [data]);

    return (
        <button
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            name="favorite"
            value={favorite ? "false" : "true"}
        >
            {favorite ? "★" : "☆"}
        </button>
    );
}
