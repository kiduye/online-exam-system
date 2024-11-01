import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="flex flex-row items-center justify-between p-4 border-b-2  w-full px-8 bg-white bg-opacity-30">
      <a
        href="/"
        className="flex items-center h-10 px-10 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-500 rounded-tl-full rounded-br-full font-bold uppercase italic text-white hover:opacity-90"
      >
        WBES
      </a>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:justify-end md:items-center md:gap-8 font-semibold flex-1  text-blue">
        <a href="#" className="text-blue-800 hover:text-blue-500">
          Home
        </a>
        <a href="#" className="text-blue-800 hover:text-blue-500">
          About
        </a>
        <a href="#" className="text-blue-800 hover:text-blue-500">
          Contact
        </a>
      </nav>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden flex-col items-end gap-1 font-semibold">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="font-bold text-xl hover:text-gray-500"
        >
          {showMenu ? <GrClose /> : <GiHamburgerMenu />}
        </button>
        {showMenu && (
          <div className="flex flex-col gap-2 mt-2">
            <a href="#" className="hover:text-blue-500">
              Home
            </a>
            <a href="#" className="hover:text-blue-500">
              About
            </a>
            <a href="#" className="hover:text-blue-500">
              Contact
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
