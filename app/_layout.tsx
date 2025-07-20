import { Slot } from "expo-router";
import * as React from "react";

import { PortalHost } from "@rn-primitives/portal";
import "react-native-reanimated";

import { AuthProvider } from "~/components/core/AuthContext";
import "./globals.css";

if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <Slot />
        <PortalHost />
      </AuthProvider>
    </>
  );
}
