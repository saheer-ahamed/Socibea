import { Outlet } from "react-router-dom";
import "./Layout.css";
import Nav from "../components/layout/Nav";
import Sidebar from "../components/layout/Sidebar";
import RightPart from "../components/layout/RightPart";
import ThemeModal from "../components/layout/ThemeModal";
import StylingFunctionalities from "../hooks/Purejs";

export default function Layout() {
  StylingFunctionalities()

  return (
    <>
    
      <Nav />
      {/* ================ MAIN ================== */}
      
      <main>
        <div className="container">
          {/* ================ LEFT ================== */}
          <Sidebar />
          {/* ================ MIDDLE ================== */}
          <Outlet />
          {/* ================ RIGHT ================== */}
          <RightPart />
        </div>
      </main>
      {/* ========================== THEME CUSTOMIZATOIN ========================== */}
      <ThemeModal />
    </>
  );
}
