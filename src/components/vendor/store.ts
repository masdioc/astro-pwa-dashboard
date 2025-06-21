import { atom } from "nanostores";
import { useStore as useStoreReact } from "@nanostores/react";
import { persistentAtom } from "@nanostores/persistent";

export const store = atom;
export const storePersistent = persistentAtom;
export const useStoreHexa = useStoreReact;
