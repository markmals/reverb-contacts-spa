import { use } from "react";
import { createAction } from "@reverb/data";
import { useNavigate } from "@reverb/router";
import { getContact } from "./_contacts.contact.$contactId";
import { contacts } from "~/lib/contacts.server";

export const updateContact = createAction(async ({ request }) => {
    "use server";
    const data = await request.formData();
    const updates = Object.fromEntries(data);
    const id = parseInt(updates.id as string);
    await contacts.update(id, updates);
    return Response.redirect(`/contact/${id}`);
});

export default function Route() {
    const contact = use(getContact());
    const navigate = useNavigate();

    return (
        <form action={updateContact} id="contact-form">
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
