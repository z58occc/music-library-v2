import { useEffect, useRef, useState } from "react";
import ProductModal from "../components/ProductModal";
import { Modal } from "bootstrap";
import axios from "../utils/axios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import Paginations from "../components/Paginations";
import Doughnut from "../components/Doughnut";
import LineChart from "../components/LineChart";
import Hint from "../components/Hint";

function DashBoard() {
  const [newData, setNewData] = useState([]);
  const [mode, setMode] = useState("");
  const [item, setItem] = useState({});
  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const url = `${import.meta.env.VITE_SUPABASE_URL}/albums`;
  const [currentData, setCurrentData] = useState([]);

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
      const res = await axios.get(url, {
        params: {
          select: "*, singers(name), formats(name)", // 直接把 singers 表的 name 帶回來
        },
      });
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
      <main className="col-md-9  col-lg-10  ">
        <h2 className="mt-3">已購買的音樂</h2>
        <div className="table-responsive small">
          <table className="table table-striped table-sm table-bordered">
            <thead>
              <tr>
                <th scope="col">id</th>
                <th scope="col" className="text-center">
                  專輯名稱
                </th>
                <th scope="col" className="text-center">
                  歌手/樂團
                </th>
                <th scope="col" className="text-center">
                  類型
                </th>
                <th scope="col" className="text-center">
                  價格
                </th>
                <th scope="col" className="text-center">
                  登記日期
                </th>
                <th scope="col" className="text-center">
                  備註
                </th>
                <th scope="col" className="text-center">
                  編輯
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData?.map((el, i) => {
                return (
                  <tr key={i}>
                    <td className="text-truncate td-id">{el.id}</td>
                    <td className="text-center">{el.name}</td>
                    <td className="text-center">{el.singers?.name}</td>
                    <td className="text-center">{el.formats?.name}</td>
                    <td className="text-center">{el.price}</td>
                    <td className="text-center">{el.released_at}</td>
                    <td className="text-center text-truncate td-note">
                      <Hint note={el.note} />
                    </td>
                    <td className="col-2 text-center">
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
                        className="btn btn-danger "
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
                <td></td>
                <td></td>
                <td className="text-center pt-3">
                  <button
                    type="button"
                    className="btn btn-dark  "
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
          <Paginations
            itemsPerPage={10}
            newData={newData}
            setCurrentData={setCurrentData}
          />
        </div>
      </main>
      <ProductModal
        modalRef={modalRef}
        handleCloseModal={handleCloseModal}
        mode={mode}
        item={item}
        fetchPost={fetchPost}
        url={url}
      />
    </>
  );
}

export default DashBoard;
