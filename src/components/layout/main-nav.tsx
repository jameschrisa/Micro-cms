import { NavLink } from "react-router-dom"
import logo from "../../assets/logo.svg"

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex flex-1">
      <NavLink
        to="/"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center justify-center w-8 h-8">
          <img 
            src={logo} 
            alt="r00k logo" 
            className="w-full h-full"
          />
        </div>
        <span className="font-semibold text-lg tracking-tight">r00k Documentation</span>
      </NavLink>
    </div>
  )
}
