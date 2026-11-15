/**
 * Accounts for the beta: stored on this phone, passwords hashed (never kept as typed). A stand-in for the
 * real backend (Supabase) that arrives in the backend phase; the screens only use these functions, so
 * swapping the store later does not change them. Plain TypeScript with no React Native imports, so it is unit-tested.
 */
export interface Account {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}
export interface AccountStore {
  load(): Promise<Account[]>;
  save(accounts: Account[]): Promise<void>;
}
export type Hasher = (text: string) => Promise<string>;
export type AuthErrorCode = 'exists' | 'wrong' | 'weak' | 'invalid';
export class AuthError extends Error {
  constructor(public code: AuthErrorCode) {
    super(code);
  }
}
export type Me = Pick<Account, 'id' | 'name' | 'email'>;

export function passwordChecks(pw: string) {
  const length = pw.length >= 8;
  const upper = /[A-Z]/.test(pw);
  const lower = /[a-z]/.test(pw);
  const number = /[0-9]/.test(pw);
  return { length, upper, lower, number, ok: length && upper && lower && number };
}

const norm = (email: string) => email.trim().toLowerCase();
const me = (a: Account): Me => ({ id: a.id, name: a.name, email: a.email });
const salted = (email: string, pw: string) => `seen:${norm(email)}:${pw}`;

export async function signUp(store: AccountStore, hash: Hasher, input: { name: string; email: string; password: string }, newId: () => string): Promise<Me> {
  const email = norm(input.email);
  if (!input.name.trim() || !/^\S+@\S+\.\S+$/.test(email)) throw new AuthError('invalid');
  if (!passwordChecks(input.password).ok) throw new AuthError('weak');
  const all = await store.load();
  if (all.some(a => a.email === email)) throw new AuthError('exists');
  const account: Account = { id: newId(), name: input.name.trim(), email, passwordHash: await hash(salted(email, input.password)) };
  await store.save([...all, account]);
  return me(account);
}

export async function signIn(store: AccountStore, hash: Hasher, emailRaw: string, password: string): Promise<Me> {
  const email = norm(emailRaw);
  const found = (await store.load()).find(a => a.email === email);
  // One message for an unknown email and a wrong password, so nobody can probe which emails have accounts.
  if (!found || found.passwordHash !== (await hash(salted(email, password)))) throw new AuthError('wrong');
  return me(found);
}

export async function findAccount(store: AccountStore, id: string): Promise<Me | null> {
  const a = (await store.load()).find(x => x.id === id);
  return a ? me(a) : null;
}
