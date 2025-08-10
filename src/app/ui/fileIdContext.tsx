'use client';

import { createContext, useContext } from "react";

export const FileIdContext = createContext<string | null>(null);

export function useFileId() {
  return useContext(FileIdContext);
}