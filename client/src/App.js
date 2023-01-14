import { Route, Routes } from "react-router-dom";
import HomeMiddle from "./pages/home/HomeMiddle";
import Layout from "./layout/Layout";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { Toaster } from "react-hot-toast";
import Bookmarks from "./pages/bookmarks/Bookmarks";
import Auth from "./pages/login/Auth";
import Error from "./pages/Error/Error";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />} exact>
            <Route path="" element={<HomeMiddle />} />
            <Route path="profile" element={<Profile />} />
            <Route path="bookmarks" element={<Bookmarks />} />
          </Route>
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Auth />} exact />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
