import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useCrosswordContext } from "../context/CrosswordContextProvider";

const CNavLink = ({ children, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isInPlay }) =>
        isInPlay ? "text-black font-bold" : "text-blue-500 hover:text-blue-800"
      }
    >
      {children}
    </NavLink>
  );
};

const Home = () => {
  const { grid } = useCrosswordContext();
  return (
    <div>
      <h1>Game Maker and Player!</h1>
      <nav>
        <ul className="flex">
          <li className="mr-6">
            <CNavLink to="/">Welcome!</CNavLink>
          </li>
          <li className="mr-6">
            <CNavLink to="/maker">Create!</CNavLink>
          </li>
          <li className="mr-6">
            {grid ? (
              <CNavLink to="/player">Play!</CNavLink>
            ) : (
              <p className="text-gray-500">Play</p>
            )}
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};
export default Home;
