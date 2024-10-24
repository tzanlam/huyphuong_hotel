import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import HomeGuest from "../pages/guest/HomeGuest";
import HomeAdmin from "../pages/admin/HomeAdmin";
import BookingsComponents from "../components/admin/BookingsComponents";
import RoomComponents from "../components/admin/RoomComponents";


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
    element: <HomeAdmin/>,
    children: [{
        path: "bookings",
        element: <BookingsComponents/>
    },
    {
        path: "rooms",
        element: <RoomComponents/>
    }
]
}
])

export default router;