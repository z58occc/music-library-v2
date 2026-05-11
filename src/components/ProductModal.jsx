import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
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

  async function onSubmit(data) {
    data = { ...data, date: moment().format("YYYY-MM-DD") };
    console.log(data);
    if (mode === "edit") {
      await axios
        .patch(`${url}?id=eq.${item.id}`, data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .post(url, data)
        .then((res) => {
          console.log(res);
          reset();
        })
        .catch((err) => {
          console.log(err);
        });
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
      console.log(ret.data.text);
      setRecoedText(ret.data.text);
      await worker.terminate();
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    setValue("name", item.name);
    setValue("singer", item.singer);
    setValue("price", item.price);
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
                {...register("singer")}
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
