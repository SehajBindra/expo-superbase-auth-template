import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Secure storage implementation for native
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Web storage implementation
const WebStorageAdapter = {
  getItem: (key: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      return Promise.resolve(window.localStorage.getItem(key));
    }
    return Promise.resolve(null);
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
    return Promise.resolve();
  },
};

const webSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const webSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const nativeSupabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const nativeSupabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

const supabaseUrl = Platform.OS === "web" ? webSupabaseUrl : nativeSupabaseUrl;
const supabaseAnonKey =
  Platform.OS === "web" ? webSupabaseAnonKey : nativeSupabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables for platform: ${Platform.OS}. ` +
      `Make sure you have ${
        Platform.OS === "web"
          ? "EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"
          : "SUPABASE_URL and SUPABASE_ANON_KEY"
      } set.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === "web" ? WebStorageAdapter : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
