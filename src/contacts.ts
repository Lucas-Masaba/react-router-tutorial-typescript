import localforage from "localforage";
import matchSorter from "match-sorter";
import sortBy from "sort-by";

interface Contact {
  id: string;
  createdAt: number;
  first?: string;
  last?: string;
}

const set = async (contacts: Contact[]): Promise<void> => {
  await localforage.setItem<Contact[]>("contacts", contacts);
};

const fakeNetwork = async (key?: string): Promise<void> => {
  if (key === undefined) {
    fakeCache = {};
  } else if (!fakeCache[key]) {
    fakeCache[key] = true;
    await new Promise<void>((res) => {
      setTimeout(res, Math.random() * 800);
    });
  }
};

let fakeCache: Record<string, boolean> = {};

export const getContacts = async (query?: string): Promise<Contact[]> => {
  await fakeNetwork(`getContacts:${query ?? ""}`);
  let contacts: Contact[] = (await localforage.getItem<Contact[]>("contacts")) || [];
  if (query) {
    const options = { keys: ["first", "last"] as (keyof Contact)[] };
    contacts = matchSorter(contacts, query, options);
  }
  return contacts.sort(sortBy("last", "createdAt"));
};
export const createContact = async (): Promise<Contact> => {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const contact: Contact = { id, createdAt: Date.now() };
  const contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
};

export const getContact = async (id: string): Promise<Contact | null> => {
  await fakeNetwork(`contact:${id}`);
  const contacts = await getContacts();
  const contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
};

export const updateContact = async (
  id: string,
  updates: Partial<Contact>
): Promise<Contact> => {
  await fakeNetwork();
  const contacts = await getContacts();
  const contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error(`No contact found for ${id}`);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
};

export const deleteContact = async (id: string): Promise<boolean> => {
  const contacts = await getContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
};