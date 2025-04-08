import { useSetAtom } from "jotai";
import { searchBar, sidebar, smallScreen } from "../atoms/ui";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ShareBrain from "../components/ShareBrain";
import DeleteContent from "../components/content/DeleteContent";
import AddContent from "../components/content/AddContent";

export default function RootLayout() {
  const setIsSearchBarOpen = useSetAtom(searchBar);
  const setIsSideBarOpen = useSetAtom(sidebar);
  const setIsSmallScreen = useSetAtom(smallScreen);
  const location = useLocation();
  const state = location.state;
  const checkWidth = () => {
    if (window.outerWidth <= 768) {
      setIsSearchBarOpen(false);
      setIsSideBarOpen(false);
      setIsSmallScreen(true);
    } else {
      setIsSearchBarOpen(true);
      setIsSideBarOpen(true);
      setIsSmallScreen(false);
    }
  };
  checkWidth();
  useEffect(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  return (
    <div className="flex h-screen w-screen flex-col gap-4 bg-gradient-to-tr from-emerald-200 via-white to-fuchsia-200 text-black md:px-4 md:py-4 lg:gap-8 lg:px-16 lg:py-8 dark:from-emerald-950 dark:via-black dark:to-fuchsia-950 dark:to-120% dark:text-white">
      <Outlet />
      {state?.modal && (
        <>
          {state?.modal === "shareBrain" && <ShareBrain />}
          {state?.modal === "addContent" && <AddContent />}
          {state?.modal === "deleteContent" && <DeleteContent />}
        </>
      )}
    </div>
  );
}
