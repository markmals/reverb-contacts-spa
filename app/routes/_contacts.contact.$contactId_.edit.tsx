import { use } from "react";
import { createAction } from "@reverb/data";
import { useNavigate } from "@reverb/router";
import { loadContact } from "./_contacts.contact.$contactId";
import { updateContact } from "~/lib/contacts.server";

export const updateAction = createAction(async ({ request }) => {
    "use server";
    const data = await request.formData();
    const updates = Object.fromEntries(data);
    const id = parseInt(updates.id as string);
    await updateContact(id, updates);
    return Response.redirect(`/contact/${id}`);
});

export default function Route() {
    const contact = use(loadContact());
    const navigate = useNavigate();

    return (
        <form action={updateAction} id="contact-form">
            <p>
                <span>Name</span>
                <input
                    aria-label="First name"
                    value={contact.first ?? undefined}
                    name="first"
                    placeholder="First"
                    type="text"
                />
                <input
                    aria-label="Last name"
                    value={contact.last ?? undefined}
                    name="last"
                    placeholder="Last"
                    type="text"
                />
            </p>
            <label>
                <span>Mastodon</span>
                <input
                    value={contact.mastodon ?? undefined}
                    name="mastodon"
                    placeholder="@Gargron@mastodon.social"
                    type="text"
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    value={contact.avatar ?? undefined}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea value={contact.notes ?? undefined} name="notes" rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">
                    Cancel
                </button>
            </p>
        </form>
    );
}
