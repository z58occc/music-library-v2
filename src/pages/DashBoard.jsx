import { useEffect, useRef, useState } from "react";
import ProductModal from "../components/ProductModal";
import { Modal } from "bootstrap";
import axios from "../utils/axios";
import Swal from "sweetalert2";

function DashBoard() {
  const [newData, setNewData] = useState([]);
  const [mode, setMode] = useState("");
  const [item, setItem] = useState({});
  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const url = import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    modalInstance.current = new Modal(modalRef.current);
  }, []);
  function handelOpenModal() {
    modalInstance.current.show();
  }
  function handleCloseModal() {
    modalInstance.current.hide();
  }
  async function fetchPost() {
    try {
      const res = await axios.get(url);
      setNewData(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  function handleDelete(id) {
    Swal.fire({
      title: "確定刪除?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "對, 刪掉它!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${url}?id=eq.${id}`);
        fetchPost();
        Swal.fire({
          title: "已刪除!",
          text: "你的檔案已被刪除",
          icon: "success",
        });
      }
    });
  }
  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <ProductModal
        modalRef={modalRef}
        handleCloseModal={handleCloseModal}
        mode={mode}
        item={item}
        fetchPost={fetchPost}
        url={url}
      />
      <header
        className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow"
        data-bs-theme="dark"
      >
        <a
          className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white"
          href="#"
        >
          實體音樂管理（後台）
        </a>
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
      <div className="container-fluid">
        <div className="row">
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 ">
            <h2 className="mt-5">已購買的音樂</h2>
            <div className="table-responsive small">
              <table className="table table-striped table-sm ">
                <thead>
                  <tr>
                    <th scope="col">id</th>
                    <th scope="col">專輯名稱</th>
                    <th scope="col">歌手/樂團</th>
                    <th scope="col">價格</th>
                    <th scope="col">登記日期</th>
                    <th scope="col">編輯</th>
                  </tr>
                </thead>
                <tbody>
                  {newData?.map((el, i) => {
                    return (
                      <tr key={i}>
                        <td>{el.id}</td>
                        <td>{el.name}</td>
                        <td>{el.singer}</td>
                        <td>{el.price}</td>
                        <td>{el.date}</td>
                        <td className="col-2">
                          <button
                            type="button"
                            className="btn btn-primary me-3"
                            onClick={() => {
                              handelOpenModal();
                              setMode("edit");
                              setItem(el);
                            }}
                          >
                            修改
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger me-3"
                            onClick={() => handleDelete(el.id)}
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-white table-light">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <button
                        type="button"
                        className="btn   mt-3 me-3 invisible"
                      >
                        新增
                      </button>
                      <button
                        type="button"
                        className="btn btn-dark  mt-3"
                        onClick={() => {
                          handelOpenModal();
                          setMode("new");
                          setItem({
                            name: "",
                            singer: "",
                            price: "",
                          });
                        }}
                      >
                        新增
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
      {/* <script
        src="../assets/dist/js/bootstrap.bundle.min.js"
        className="astro-vvvwv3sm"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.3.2/dist/chart.umd.js"
        integrity="sha384-eI7PSr3L1XLISH8JdDII5YN/njoSsxfbrkCTnJrzXt+ENP5MOVBxD+l6sEG4zoLp"
        crossOrigin="anonymous"
        className="astro-vvvwv3sm"
      ></script>
      <script src="dashboard.js" className="astro-vvvwv3sm"></script> */}
    </>
  );
}

export default DashBoard;
