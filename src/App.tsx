
import { Outlet } from 'react-router'
import CommonLayout from './components/ui/layout/CommonLayout'
import { generateRoutes } from './components/ui/utils/generateRoutes'
import { adminSidebarItems } from './routes/adminSidebarItems'

export default function App() {
  console.log(generateRoutes(adminSidebarItems))
  return (
    <div>
  <CommonLayout>
      <Outlet/>
  </CommonLayout>
 
    </div>
  )
}
