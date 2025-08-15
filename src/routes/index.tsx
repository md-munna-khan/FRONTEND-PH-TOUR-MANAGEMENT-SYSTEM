import App from "@/App";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";

import About from "@/pages/About";
import Analytics from "@/pages/Analytics";
import Login from "@/pages/login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";



import { createBrowserRouter } from "react-router";

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
        {
          Component:Analytics,
          path:"analytics"
        }
      ]
    }
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