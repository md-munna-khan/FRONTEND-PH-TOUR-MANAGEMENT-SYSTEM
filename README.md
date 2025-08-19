GitHub Link: https://github.com/Apollo-Level2-Web-Dev/ph-tour-management-system-frontend/tree/part-4

Ph tour Management Frontend Part-4
## 38-1 Setting Up the Dashboard and Admin Routes
- index.tsx
```ts
import App from "@/App";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";

import About from "@/pages/About";
import AddTour from "@/pages/Admin/AddTour";
import Analytics from "@/pages/Admin/Analytics";
import Login from "@/pages/login";
import Register from "@/pages/Register";
import Bookings from "@/pages/User/Bookings";
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
        },
        {
          Component:AddTour,
          path:"add-tour"
        }
      ]
    },
    {
      Component:DashboardLayout,
      path:"/user",
      children:[
        {
          Component:Bookings,
          path:"bookings"
        }
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
```
## 38-2 Building the Dashboard Using ShadCN UI Blocks
- absolute path /admin means 
- relative path add-tour if you direct show to relative /admin/add-tour

```ts
   {
      Component:DashboardLayout,
      path:"/admin",
      children:[
        {
          Component:Analytics,
          path:"analytics"
        },
        {
          Component:AddTour,
          path:"add-tour"
        },
        {
          Component:AddTour,
          path:"/admin/add-tour"
        }
      ]
    },
```
## 38-3 Generating Routes Dynamically from Sidebar Items
- index.tsx
```ts
import App from "@/App";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { generateRoutes } from "@/components/ui/utils/generateRoutes";

import About from "@/pages/About";
import AddTour from "@/pages/Admin/AddTour";
import Analytics from "@/pages/Admin/Analytics";
import Login from "@/pages/login";
import Register from "@/pages/Register";
import Bookings from "@/pages/User/Bookings";
import Verify from "@/pages/Verify";



import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";

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
      children:[...generateRoutes(adminSidebarItems)]
    },
    {
      Component:DashboardLayout,
      path:"/user",
      children:[
        {
          Component:Bookings,
          path:"bookings"
        }
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
```
- generateRoutes.tsx
- use flat map
```ts
import type { ISidebarItem } from "@/types";


export const generateRoutes = (sidebarItems: ISidebarItem[]) => {
  return sidebarItems.flatMap((section) =>
    section.items.map((route) => ({
      path: route.url,
      Component: route.component,
    }))
  );
};
```
- adminSidebar.tsx
```ts 
import AddTour from "@/pages/Admin/AddTour";
import Analytics from "@/pages/Admin/Analytics";
import type { ISidebarItem } from "@/types";




export const adminSidebarItems :ISidebarItem[]= [
    {
      title: "Dashboard",
   
      items: [
        {
          title: "Analytics",
          url: "/admin/analytics",
          component:Analytics
        },
       
      ],
    },
    {
      title: "Tour Management",
 
      items: [
        {
          title: "Add Tour",
          url: "/admin/add-tour",
          component:AddTour
        },
        {
          title: "Add Tour",
          url: "/admin/add-tour",
          component:AddTour
        }
       
      ],
    }
   
  ]
```
## 38-4 Rendering Sidebar Items Based on User Role

- src -> constants -> role.ts

```ts
export const role = {
  superAdmin: "SUPER_ADMIN",
  admin: "ADMIN",
  user: "USER",
};
```

- routes -> index.ts

```ts
import App from "@/App";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/verify";
import { generateRoutes } from "@/utils/generateRoutes";

import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "about",
      },
    ],
  },
  {
    Component: DashboardLayout,
    path: "/admin",
    children: [...generateRoutes(adminSidebarItems)],
  },
  {
    Component: DashboardLayout,
    path: "/user",
    children: [...generateRoutes(userSidebarItems)],
  },
  {
    Component: Login,
    path: "login",
  },
  {
    Component: Register,
    path: "register",
  },
  {
    Component: Verify,
    path: "verify",
  },
]);
```

- types -> auth.types.ts

```ts
import type { ComponentType } from "react";

export interface ISendOtp {
  email: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ISidebarItems {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "USER";
```

- utils - > getSidebarItem.ts

```ts
import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { TRole } from "@/types";

export const generateSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.superAdmin: {
      return [...adminSidebarItems];
    }
    case role.admin: {
      return [...adminSidebarItems];
    }

    case role.user: {
      return [...userSidebarItems];
    }
    default:
      return [];
  }
};
```

- components -> app-sidebar.tsx

```tsx
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/assets/icons/Logo";
import { Link } from "react-router";
import { generateSidebarItems } from "@/utils/generateSidebarItems";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useUserInfoQuery(undefined);
  // This is sample data.
  const data = {
    navMain: generateSidebarItems(userData?.data?.role),
  };

  console.log(data);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
```

## 38-5 Recap and Discussion on Completed Work

- we can grant access more to superAdmin

```ts
import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { TRole } from "@/types";

export const generateSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.superAdmin: {
      return [...adminSidebarItems, ...userSidebarItems]; // multi access
    }
    case role.admin: {
      return [...adminSidebarItems];
    }

    case role.user: {
      return [...userSidebarItems];
    }
    default:
      return [];
  }
};
```

- Navbar.tsx

```tsx
import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModeToggle } from "./ModeToggler";
import { Link } from "react-router";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { role } from "@/constants/role";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/", label: "Home", role: "PUBLIC" },
  { href: "/about", label: "About", role: "PUBLIC" },
  { href: "/admin", label: "Dashboard", role: role.admin },
  { href: "/user", label: "Dashboard", role: role.user },
];

export default function Navbar() {
  const { data } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  console.log(data?.data?.email);

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink asChild className="py-1.5">
                        <Link to={link.href}>{link.label} </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      asChild
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      <Link to={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {data?.data?.email && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-sm"
            >
              Logout
            </Button>
          )}
          {!data?.data?.email && (
            <Button asChild className="text-sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
```

## 38-6 UX and Performance Enhancements with Lazy Loading

- Navbar.tsx (update in Dashboard Button)

```tsx
import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModeToggle } from "./ModeToggler";
import { Link } from "react-router";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { role } from "@/constants/role";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/", label: "Home", role: "PUBLIC" },
  { href: "/about", label: "About", role: "PUBLIC" },
  { href: "/admin", label: "Dashboard", role: role.admin },
  { href: "/admin", label: "Dashboard", role: role.superAdmin },
  { href: "/user", label: "Dashboard", role: role.user },
];

export default function Navbar() {
  const { data } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink asChild className="py-1.5">
                        <Link to={link.href}>{link.label} </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <>
                    {link.role === "PUBLIC" && (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          asChild
                          className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                        >
                          <Link to={link.href}>{link.label}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                    {link.role === data?.data?.role && (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          asChild
                          className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                        >
                          <Link to={link.href}>{link.label}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                  </>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {data?.data?.email && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-sm"
            >
              Logout
            </Button>
          )}
          {!data?.data?.email && (
            <Button asChild className="text-sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
```

- routes -> index.ts

```ts
        {
            Component: DashboardLayout,
            path: "/admin",

            children: [
                {index : true, element : <Navigate to="/admin/analytics"/>},
                ...generateRoutes(adminSidebarItems)]
        },
```

- This Will by default navigate to the analytic page if we hit admin page.

#### Lazy Loading

- Lazy loading in React means loading components only when needed, using React.lazy and Suspense (or other code-splitting techniques), which makes your app faster to load and more efficient.

- The problem of the site is now that in client side rendering the browser tries to load the ts js or tsx files then loads the contents. For home page public pages its ok. But the problem is its also loading the private route element like `Analytics.tsx` which is not required to load as its a admin route. W can prevent this by using `lazy loading`. Lazy Loading only loads the component when the component related functions are hit.

- adminSidebarItems.tsx

```ts
const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
```

```tsx
import AddTour from "@/pages/Admin/AddTour";

import type { ISidebarItems } from "@/types";
import { lazy } from "react";

// import Analytics from "@/pages/Admin/Analytics";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));

export const adminSidebarItems: ISidebarItems[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        component: AddTour,
      },
      {
        title: "Add Tour Type",
        url: "/admin/add-tour-type",
        component: AddTour,
      },
    ],
  },
];
```
## 38-7 Implementing Route Authorization via Higher-Order Components (HOC)

- Make a secure routing

- utils -> withAuth.tsx

```tsx
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  //  as we can not directly call a query inside a function so we have returned a component type function inside
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!isLoading && !data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" />;
    }
    return <Component />;
  };
};
```

- we can easily wrap the route

```ts
       {
            Component: App,
            path: "/",
            children: [
                {
                    Component: withAuth(About),
                    path: "about"
                }
            ]
        },
        {
            Component: withAuth(DashboardLayout, role.superAdmin as TRole),
            path: "/admin",

            children: [
                { index: true, element: <Navigate to="/admin/analytics" /> },
                ...generateRoutes(adminSidebarItems)]
        },
```
## 38-8 Adding “Tour Type” Feature and Updating the Corresponding Backend Endpoint

- add table

```
bunx --bun shadcn@latest add table
```

- redux -> features -> tour -> tour.api.ts

```ts
import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTourType: builder.mutation({
      query: (tourTypeName) => ({
        url: "/tours/create-tour-type",
        method: "POST",
        data: tourTypeName,
      }),
    }),

    getTourTypes: builder.query({
      query: () => ({
        url: "/tours/tour-types",
        method: "GET",
      }),
    }),
  }),
});

export const { useAddTourTypeMutation, useGetTourTypesQuery } = tourApi;
```

- routes -> adminSidebarItems.ts

```ts
import AddTour from "@/pages/Admin/AddTour";
import AddTourType from "@/pages/Admin/AddTourType";

import type { ISidebarItems } from "@/types";
import { lazy } from "react";

// import Analytics from "@/pages/Admin/Analytics";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));

export const adminSidebarItems: ISidebarItems[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        component: AddTour,
      },
      {
        title: "Add Tour Type",
        url: "/admin/add-tour-type",
        component: AddTourType,
      },
    ],
  },
];
```

- pages -> admin -> AAddTourType.tsx

```tsx
import { useGetTourTypesQuery } from "@/redux/features/tour/tour.api";

const AddTourType = () => {
  const { data } = useGetTourTypesQuery(undefined);
  console.log(data);
  return (
    <div>
      <h1>This is AddTourType component</h1>
    </div>
  );
};

export default AddTourType;
```

- Response will give us a lot of data like success , meta,data but we can transform the data using rtk like we can just get data 

```ts 
    getTourTypes: builder.query({
      query: () => ({
        url: "/tours/tour-types",
        method: "GET",
      }),
      transformResponse : (response) => response.data
    }),
```
## 38-9 Managing Data Display with ShadCN Table

- pages -> admin -> AddTourType.tsx

```tsx 

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,

  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTourTypesQuery } from "@/redux/features/tour/tour.api";

import { Trash2 } from "lucide-react";

export default function AddTourType() {
  const { data } = useGetTourTypesQuery(undefined);

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <div className="flex justify-between my-8">
        <h1 className="text-xl font-semibold">Tour Types</h1>
      </div>
      <div className="border border-muted rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item: { name: string }) => (
              <TableRow>
                <TableCell className="font-medium w-full">
                  {item?.name}
                </TableCell>
                <TableCell>
                  <Button size="sm">
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```
## 38-10 Recap on Data Refetching and Cache Revalidation
- component -> module -> Admin -> AddTourTypeModal.tsx

```tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddTourTypeMutation } from "@/redux/features/tour/tour.api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddTourTypeModal() {
  const form = useForm();
  const [addTourType] = useAddTourTypeMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const res = await addTourType({ name: data.name }).unwrap();
    if (res.success) {
      toast.success("Tour Type Added");
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Add Tour Type</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Tour Type</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form id="add-tour-type" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Type Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tour Type Name"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="add-tour-type">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
```

- pages -> admin -> addTourType.tsx 

```tsx 
import { AddTourTypeModal } from "@/components/modules/Admin/TourType/AddTourTypeModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTourTypesQuery } from "@/redux/features/tour/tour.api";

import { Trash2 } from "lucide-react";

export default function AddTourType() {
  const { data } = useGetTourTypesQuery(undefined);

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <div className="flex justify-between my-8">
        <h1 className="text-xl font-semibold">Tour Types</h1>
        <AddTourTypeModal />
      </div>
      <div className="border border-muted rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item: { name: string }) => (
              <TableRow>
                <TableCell className="font-medium w-full">
                  {item?.name}
                </TableCell>
                <TableCell>
                  <Button size="sm">
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

- For Refreshing 

- redux  -> baseApi.ts

```ts 
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  //   baseQuery: fetchBaseQuery({
  //     baseUrl: config.baseUrl,
  //     credentials: "include",
  //   }),
  tagTypes: ["USER", "TOUR"],
  endpoints: () => ({}),
});
```

- redux -> features -> tour -> tour.api.ts 

```ts 
import { baseApi } from "@/redux/baseApi";



export const tourApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addTourType: builder.mutation({
            query: (tourTypeName) => ({
                url: "/tours/create-tour-type",
                method: "POST",
                data: tourTypeName,
            }),
            invalidatesTags: ["TOUR"],
        }),

        getTourTypes: builder.query({
            query: () => ({
                url: "/tours/tour-types",
                method: "GET",
            }),
            providesTags: ["TOUR"],
            transformResponse: (response) => response.data
        }),
    }),
});

export const {
    useAddTourTypeMutation,
    useGetTourTypesQuery
} = tourApi;
```