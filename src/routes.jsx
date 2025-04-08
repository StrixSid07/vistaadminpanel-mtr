import {
  HomeIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  MapPinIcon,
  HomeModernIcon,
  UserCircleIcon,
  UserIcon,
  SwatchIcon,
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
  ManageFaqs,
  ManageTerms,
  ManageDeals,
  ManageDeals2,
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
        icon: <UserIcon {...icon} />,
        name: "Manage Users",
        path: "/manage-users",
        element: <ManageUsers />,
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
        icon: <SwatchIcon {...icon} />,
        name: "Manage Deals",
        path: "/manage-deals",
        element: <ManageDeals />,
      },
      {
        icon: <SwatchIcon {...icon} />,
        name: "Manage Deals 2",
        path: "/manage-deals2",
        element: <ManageDeals2 />,
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "Manage Faqs",
        path: "/manage-faqs",
        element: <ManageFaqs />,
      },
      {
        icon: <CheckCircleIcon {...icon} />,
        name: "Manage Terms",
        path: "/manage-terms",
        element: <ManageTerms />,
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
