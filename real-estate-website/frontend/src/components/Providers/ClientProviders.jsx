"use client";

import { ToastProvider } from "../../context/ToastContext";

export default function ClientProviders({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
