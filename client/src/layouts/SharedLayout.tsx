import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function SharedLayout() {
  return (
    <>
      <Navbar />
      <main className="flex h-[calc(100vh-64px)] flex-1 gap-2 px-4 md:h-[calc(100vh-96px)] md:gap-4 md:px-0 lg:h-full lg:gap-8">
        <Sidebar isVisitor={true} />
        <Outlet />
      </main>
    </>
  );
}
