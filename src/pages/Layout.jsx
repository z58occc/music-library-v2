import { Outlet } from "react-router";
import { NavLink } from "react-router";

function Layout() {
  return (
    <>
      <header
        className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow"
        data-bs-theme="dark"
      >
        <NavLink
          className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white
          title
          "
          to="/"
        >
          實體音樂管理（後台）
        </NavLink>
        <ul className="navbar-nav flex-row d-md-none">
          <li className="nav-item text-nowrap">
            <button
              className="nav-link px-3 text-white"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSearch"
              aria-controls="navbarSearch"
              aria-expanded="false"
              aria-label="Toggle search"
            >
              <svg className="bi" aria-hidden="true">
                <use xlinkHref="#search"></use>
              </svg>
            </button>
          </li>
          <li className="nav-item text-nowrap">
            <button
              className="nav-link px-3 text-white"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <svg className="bi" aria-hidden="true">
                <use xlinkHref="#list"></use>
              </svg>
            </button>
          </li>
        </ul>
        <div id="navbarSearch" className="navbar-search w-100 collapse">
          <input
            className="form-control w-100 rounded-0 border-0"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
        </div>
      </header>
      <div className="row w-100">
        <div className="sidebar vh-100 border border-right col-lg-2 p-0 bg-dark-subtle  border-0">
          <div
            className=""
            tabIndex="-1"
            id="sidebarMenu"
            aria-labelledby="sidebarMenuLabel"
          >
            <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
              <ul className="nav flex-column ">
                <li className="nav-item">
                  <NavLink
                    className="nav-link d-flex    fs-5"
                    aria-current="page"
                    to="/"
                  >
                    <i className="bi bi-table me-3"></i>
                    <span>購買記錄</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex  fs-5" to="/chart">
                    <i className="bi bi-graph-up-arrow me-3"></i>
                    <span>消費分析</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
export default Layout;
