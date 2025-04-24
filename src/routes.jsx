import {
  HomeIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  MapPinIcon,
  HomeModernIcon,
  PhotoIcon,
  UserCircleIcon,
  UserIcon,
  SwatchIcon,
  TagIcon,
  NewspaperIcon,
  CreditCardIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  TicketIcon,
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
  ManageCarousel,
  ManageHolidayCategories,
  ManageBlog,
  ManageBooking,
} from "@/pages/dashboard";
import { SignUp, LogIn } from "@/pages/auth";
import ManageNewsletter from "./pages/dashboard/managenewslatter";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      // {
      //   icon: <HomeIcon {...icon} />,
      //   name: "dashboard",
      //   path: "/home",
      //   element: <Home />,
      // },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tables",
      //   path: "/tables",
      //   element: <Tables />,
      // },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
      {
        icon: <UserIcon {...icon} />,
        name: "Manage Users",
        path: "/manage-users",
        element: <ManageUsers />,
      },
      {
        icon: <TicketIcon {...icon} />,
        name: "Manage Booking",
        path: "/manage-booking",
        element: <ManageBooking />,
      },
      {
        icon: <HomeModernIcon {...icon} />,
        name: "Manage Hotels",
        path: "/manage-hotel",
        element: <ManageHotel />,
      },
      {
        icon: <TagIcon {...icon} />,
        name: "Manage H Categories",
        path: "/Manage-holiday-categories",
        element: <ManageHolidayCategories />,
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Manage Destination",
        path: "/manage-destination",
        element: <ManageDestination />,
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "Manage Newslatter",
        path: "/manage-newslatter",
        element: <ManageNewsletter />,
      },
      {
        icon: <CreditCardIcon {...icon} />,
        name: "Manage Blog",
        path: "/manage-blog",
        element: <ManageBlog />,
      },
      {
        icon: <SwatchIcon {...icon} />,
        name: "Manage Deals",
        path: "/manage-deals",
        element: <ManageDeals />,
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
      {
        icon: <PhotoIcon {...icon} />,
        name: "Manage Carousel",
        path: "/manage-carousel",
        element: <ManageCarousel />,
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
      // {
      //   icon: <RectangleStackIcon {...icon} />,
      //   name: "sign up",
      //   path: "/sign-up",
      //   element: <SignUp />,
      // },
    ],
  },
];

export default routes;
