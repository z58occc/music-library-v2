import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import moment from "moment/moment";
import { createWorker } from "tesseract.js";
import "bootstrap-icons/font/bootstrap-icons.css";

function ProductModal({
  modalRef,
  handleCloseModal,
  mode,
  item,
  fetchPost,
  url,
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      singers: [{ name: "" }], // 預設一個空欄位
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "singers",
  });

  const [type, setType] = useState([]);

  async function upsertSinger(singer) {
    const singerRes = await axios.post(
      `${url}/singers`,
      { name: singer.name },
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
    data = { ...data, updated_at: moment().format("YYYY-MM-DD") };
    const { singers, ...rest } = data;

    try {
      // 1. upsert 所有歌手，拿到所有 singer_id
      const singerIds = await Promise.all(
        singers.map(async (singer) => {
          const singerRes = await upsertSinger(singer);
          return singerRes.data[0].id;
        }),
      );

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
        await axios.post(
          `${url}/album_singers`,
          singerIds.map((singer_id) => ({ album_id: item.id, singer_id })),
        );
      } else {
        //新增專輯
        const albumRes = await axios.post(`${url}/albums`, rest, {
          headers: { Prefer: "return=representation" },
        });
        const albumId = albumRes.data[0].id;

        await axios.post(
          `${url}/album_singers`,
          singerIds.map((singer_id) => ({ album_id: albumId, singer_id })),
        );
        reset();
      }
    } catch (err) {
      alert("修改或新增失敗");
      console.log(err.response);
    }

    handleCloseModal();
    fetchPost();
  }

  
  useEffect(() => {
    reset({
      name: item.name,
      price: item.price,
      note: item.note,
      format_id: item.format_id,
      updated_at: item.updated_at,
      singers: item.singers?.map((s) => ({ name: s.name })),
    });
  }, [mode, item]);

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

              <label className="mt-3">歌手或樂團：</label>

              {fields.map((field, index) => (
                <div key={field.id} className="d-flex mt-1">
                  <input
                    className="form-control "
                    {...register(`singers.${index}.name`)}
                    placeholder="歌手名稱"
                  />
                  {fields.length > 1 && (
                    <button
                      className="btn btn-danger btn-sm m-1"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      －
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-success btn-sm mt-3"
                onClick={() => append({ name: "" })}
              >
                ＋ 新增歌手
              </button>
              <br />

              <label className="mt-3" htmlFor="price">
                價格：
              </label>
              <input
                id="price"
                className="form-control "
                type="number"
                {...register("price", { required: true, min: 0 })}
              />
              <label className="mt-3" htmlFor="cover_url">
                封面url：
              </label>
              <input
                id="cover_url"
                className="form-control "
                type="text"
                {...register("cover_url")}
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
