import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "../../utils";

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 py-3 text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-muted overflow-x-auto no-scrollbar">
      <Link 
        to="/" 
        className="flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600 flex-shrink-0" />
            {last ? (
              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold whitespace-nowrap">{value.replace("-", " ")}</span>
            ) : (
              <Link to={to} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors whitespace-nowrap">
                {value.replace("-", " ")}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
