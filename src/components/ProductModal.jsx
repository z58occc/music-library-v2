import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import moment from "moment/moment";
import { createWorker } from "tesseract.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Tooltip } from "react-tooltip";

function ProductModal({
  modalRef,
  handleCloseModal,
  mode,
  item,
  fetchPost,
  url,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [recoText, setRecoText] = useState("");
  const [recoedText, setRecoedText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState([]);

  async function upsertSinger(data) {
    const singerRes = await axios.post(
      `${url}/singers`,
      { name: data.singer },
      {
        params: { on_conflict: "name" },
        headers: {
          Prefer: "return=representation,resolution=merge-duplicates",
        },
      },
    );
    return singerRes;
  }

  async function onSubmit(data) {
    data = { ...data, released_at: moment().format("YYYY-MM-DD") };
    const { singer, ...rest } = data;

    try {
      // 1. upsert 歌手
      const singerRes = await upsertSinger(data);
      const singerId = singerRes.data[0].id;
      if (mode === "edit") {
        await axios.patch(`${url}/albums`, rest, {
          params: { id: `eq.${item.id}` }, // 移到這裡
        });
        // 刪除舊關聯（橋接表）
        await axios.delete(`${url}/album_singers`, {
          params: { album_id: `eq.${item.id}` },
        });
        // 新增新關聯
        await axios.post(`${url}/album_singers`, {
          album_id: item.id,
          singer_id: singerId,
        });
      } else {
        //新增專輯
        const albumRes = await axios.post(`${url}/albums`, rest, {
          headers: { Prefer: "return=representation" },
        });
        const albumId = albumRes.data[0].id;

        await axios.post(`${url}/album_singers`, {
          album_id: albumId,
          singer_id: singerId,
        });
        reset();
      }
    } catch (err) {
      console.log(err.response);
      console.log("修改或新增失敗");
    }

    handleCloseModal();
    fetchPost();
  }

  async function recognizeText(img) {
    try {
      if (!img) return;
      if (typeof img !== "string") img = URL.createObjectURL(img);
      setImgSrc(img);
      const worker = await createWorker("jpn");
      const ret = await worker.recognize(img);
      setRecoedText(ret.data.text);
      await worker.terminate();
    } catch (err) {
      alert("不知道哪裡出了錯誤,請換張圖片試試看");
    }
  }
  useEffect(() => {
    setValue("name", item.name);
    setValue("singer", item.singers?.name ? item.singers?.name : "");
    setValue("price", item.price);
    setValue("format_id", item.format_id);
  }, [mode, item]);

  useEffect(() => {
    recognizeText(imageFile);
  }, [imageFile]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(recoedText);
      setIsOpen(true);
      console.log("成功");
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function fetchType() {
      try {
        const res = await axios.get(`${url}/formats`);
        setType(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchType();
  }, []);

  return (
    <div ref={modalRef} className="modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "new" ? "新增" : item.name}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="" htmlFor="name">
                專輯名稱：
              </label>
              <input
                id="name"
                className="form-control "
                type="text"
                {...register("name", { required: true })}
              />
              <label className="mt-3" htmlFor="singer">
                歌手或樂團：
              </label>
              <input
                id="singer"
                className="form-control "
                type="text"
                {...register("singer", { defaultValues: "" })}
              />
              <label className="mt-3" htmlFor="price">
                價格：
              </label>
              <input
                id="price"
                className="form-control "
                type="number"
                {...register("price", { required: true, min: 0 })}
              />
              <label className="mt-3" htmlFor="type">
                類型:
              </label>
              <select
                className="form-select w-25"
                aria-label="Default select example"
                {...register("format_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">唱片類型</option>
                {type?.map((el) => {
                  return (
                    <option value={el.id} key={el.id}>
                      {el.name}
                    </option>
                  );
                })}
              </select>
              <label className="mt-5" htmlFor="img">
                日文圖片辨識（輸入圖片網址或上傳圖片）
              </label>
              <div className="d-flex align-items-center">
                <input
                  id="img"
                  className="form-control "
                  type="text"
                  accept="image"
                  onChange={(e) => setRecoText(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-info btn-sm text-nowrap ms-3"
                  onClick={() => recognizeText(recoText)}
                >
                  辨識
                </button>
              </div>
              <input
                id="img"
                className="form-control mt-3"
                type="file"
                accept="image"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {imgSrc ? (
                <>
                  <img
                    src={imgSrc}
                    className="w-100 border my-3 border-dark"
                    alt="目前沒有提供可辨識的圖片"
                  />
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="border ">{recoedText}</p>
                    <Tooltip id="my-tooltip" isOpen={isOpen} />
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="複製成功！"
                    >
                      <i className="bi bi-copy mx-3  h3" onClick={handleCopy} />
                    </a>
                  </div>
                </>
              ) : (
                ""
              )}
              <label className="mt-3" htmlFor="note">
                備註:
              </label>
              <textarea
                id="note"
                className="form-control "
                type="number"
                {...register("note")}
              />

              <div className="d-flex mt-3 justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-3"
                  onClick={handleCloseModal}
                >
                  取消
                </button>
                <input type="submit" className="btn btn-primary" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
