import { Contact, Contacts, db } from "./db.server";
import { eq } from "drizzle-orm";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export namespace contacts {
    export async function getAll(query?: string) {
        await fakeNetwork(`getContacts:${query}`);
        let contacts = await db.select().from(Contacts);
        if (query) {
            contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
        }
        return contacts.sort(sortBy("last", "createdAt"));
    }

    export async function create() {
        await fakeNetwork();
        return await db
            .insert(Contacts)
            .values({
                first: "",
                last: "",
                avatar: "",
                mastodon: "",
            })
            .returning()
            .get();
    }

    export async function get(id?: number) {
        await fakeNetwork(`contact:${id}`);
        return await db
            .select()
            .from(Contacts)
            .where(eq(Contacts.id, id ?? -1))
            .get();
    }

    export async function update(id: number, updates: Partial<Contact>) {
        await fakeNetwork();
        return await db.update(Contacts).set(updates).where(eq(Contacts.id, id));
    }

    export async function del(id: number) {
        return await db.delete(Contacts).where(eq(Contacts.id, id));
    }
}

// fake a cache so we don't slow down stuff we've already seen
const fakeCache = new Map<string, boolean>();

async function fakeNetwork(key?: string): Promise<void> {
    if (!key || !fakeCache.get(key)) {
        if (key) fakeCache.set(key, true);

        return new Promise(res => {
            setTimeout(res, Math.random() * 1000);
        });
    }
}
