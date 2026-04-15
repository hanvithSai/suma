"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as Ably from "ably";

interface AblyContextProps {
  client: Ably.Realtime | null;
  connectionStatus: string;
}

const AblyContext = createContext<AblyContextProps>({
  client: null,
  connectionStatus: "initialized",
});

export const useAbly = () => useContext(AblyContext);

export const AblyProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("initialized");

  useEffect(() => {
    // Initialize Ably client with token authentication
    const ably = new Ably.Realtime({
      authUrl: "/api/ably-token",
    });

    ably.connection.on("connected", () => {
      setConnectionStatus("connected");
    });

    ably.connection.on("disconnected", () => {
      setConnectionStatus("disconnected");
    });

    ably.connection.on("failed", () => {
      setConnectionStatus("failed");
    });

    setClient(ably);

    return () => {
      ably.close();
    };
  }, []);

  return (
    <AblyContext.Provider value={{ client, connectionStatus }}>
      {children}
    </AblyContext.Provider>
  );
};
