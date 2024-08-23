import * as Realm from "realm-web";

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID || '';

export const app = new Realm.App({ id: REALM_APP_ID });

export async function loginAdmin() {
  const apiKey = process.env.REALM_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is not set in environment variables");
  }

  try {
    const credentials = Realm.Credentials.apiKey(apiKey);
    return await app.logIn(credentials);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export { Realm };
