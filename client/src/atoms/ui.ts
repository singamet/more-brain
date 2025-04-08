import { atom } from "jotai";

export const smallScreen = atom(false);
export const searchBar = atom(false);
export const sidebar = atom(true);
export const authToggle = atom(false);
export const addContentToggleAtom = atom(false);
export const showPassword = atom(false);
export const showDropDown = atom(false);
export const currentDropDownValue = atom("Document");
export const linkPreviewAtom = atom({
  title: "",
  description: "",
  image: "",
  url: "",
});
