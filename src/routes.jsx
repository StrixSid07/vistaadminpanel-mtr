import {
  HomeIcon,
  MapPinIcon,
  HomeModernIcon,
  UserCircleIcon,
  UserIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import {
  Home,
  Profile,
  Tables,
  Notifications,
  ManageHotel,
  ManageDestination,
  ManageUsers,
} from "@/pages/dashboard";
import { SignUp, LogIn } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <HomeModernIcon {...icon} />,
        name: "Manage Hotels",
        path: "/manage-hotel",
        element: <ManageHotel />,
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Manage Destination",
        path: "/manage-destination",
        element: <ManageDestination />,
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Manage Users",
        path: "/manage-users",
        element: <ManageUsers />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <LogIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
