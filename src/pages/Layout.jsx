import { Outlet } from "react-router";
import { NavLink } from "react-router";
import LogInModal from "../components/LogInModal";
import { useRef, useEffect, useState } from "react";
import { Modal } from "bootstrap";

function Layout() {
  const logInModalRef = useRef(null);
  const modalInstance = useRef(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    modalInstance.current = new Modal(logInModalRef.current);
  }, []);
  function handleOpenModal() {
    modalInstance.current.show();
  }
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
        <button
          type="button"
          className="btn btn-secondary me-3"
          onClick={handleOpenModal}
        >
          登入
        </button>
      </header>
      <div className="row w-100">
        <div className="sidebar  border border-right col-lg-2 p-0 bg-dark-subtle  border-0">
          <div
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
      <LogInModal logInModalRef={logInModalRef} setToken={setToken} />
    </>
  );
}
export default Layout;
