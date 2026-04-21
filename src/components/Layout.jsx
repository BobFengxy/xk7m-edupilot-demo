import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import BackgroundFX from './BackgroundFX'

export default function Layout() {
  return (
    <div className="flex h-full w-full relative">
      <BackgroundFX />
      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header />
          <main className="flex-1 overflow-hidden min-h-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
