import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import HomeGuest from "../pages/guest/HomeGuest";
import HomeAdmin from "../pages/admin/HomeAdmin";


const router = createBrowserRouter([
{
    path: "/",
    element: <MainPage />   
},
{
    path: "/login",
    element: <LoginPage />
},
{
    path: "/home",
    element: <HomeGuest/>
},
{
    path: "/homeadmin",
    element: <HomeAdmin/>
}
])

export default router;