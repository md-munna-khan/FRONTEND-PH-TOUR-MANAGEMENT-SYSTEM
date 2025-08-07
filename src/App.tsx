
import { Outlet } from 'react-router'
import CommonLayout from './components/ui/layout/CommonLayout'

export default function App() {
  return (
    <div>
  <CommonLayout>
      <Outlet/>
  </CommonLayout>
 
    </div>
  )
}
