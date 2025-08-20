import App from "@/App";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { generateRoutes } from "@/components/ui/utils/generateRoutes";

import About from "@/pages/About";

import Login from "@/pages/login";
import Register from "@/pages/Register";

import Verify from "@/pages/Verify";



import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import { withAuth } from "@/components/ui/utils/withAuth";
import Unauthorized from "@/pages/Unauthorized";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import { HomePage } from "@/pages/Homepage";

export const router = createBrowserRouter([
    {
        Component:App,
        path:"/",
        children:[
         {
       Component:HomePage,
        index:true
         },
            {
                Component: withAuth(About),
                path:"about"
            }
        ]
    },
    {
      Component: withAuth (DashboardLayout,role.superAdmin as TRole),
      path:"/admin",
      children:[
        {index:true,element:<Navigate to="/admin/analytics"/>},
        ...generateRoutes(adminSidebarItems)
      ]
    },
    {
     Component: withAuth (DashboardLayout,role.user as TRole),
      path:"/user",
      children:[
         {index:true,element:<Navigate to="/user/bookings"/>},
      ...generateRoutes(userSidebarItems)
      ]
    },
    {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: Verify,
    path: "/verify",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
  
])