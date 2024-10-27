import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import HomeGuest from "../pages/guest/HomeGuest";
import HomeAdmin from "../pages/admin/HomeAdmin";
import BookingsComponents from "../components/admin/BookingsComponents";
import RoomComponents from "../components/admin/RoomComponents";
import RoomCard from "../components/user/RoomCard";
import BookingForm from "../components/user/Booking";
import Contact from "../components/user/Contact";
import SearchRoom from "../components/user/SearchRoom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomeGuest />,
    children: [
      {
        path: "searchRoom",
        element: <SearchRoom/>
      },
      {
        path: "roomguest",
        element: <RoomCard />,
      },
      {
        path: "bookingguest",
        element: <BookingForm />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/homeadmin",
    element: <HomeAdmin />,
    children: [
      {
        path: "bookings",
        element: <BookingsComponents />,
      },
      {
        path: "rooms",
        element: <RoomComponents />,
      },
    ],
  },
]);

export default router;
