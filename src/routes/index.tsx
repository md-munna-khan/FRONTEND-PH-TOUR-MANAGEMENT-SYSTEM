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

export const router = createBrowserRouter([
    {
        Component:App,
        path:"/",
        children:[
            {
                Component:About,
                path:"about"
            }
        ]
    },
    {
      Component:DashboardLayout,
      path:"/admin",
      children:[
        {index:true,element:<Navigate to="/admin/analytics"/>},
        ...generateRoutes(adminSidebarItems)
      ]
    },
    {
      Component:DashboardLayout,
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
  
])