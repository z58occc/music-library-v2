import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabase";
import { useState } from "react";

function LogInModal({ logInModalRef, setToken }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(formData) {
    const { email, password } = formData;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      setErrorMsg(error.message);
      return;
    }
    console.log("登入成功", data);
    setToken(data.session.access_token);
  }

  return (
    <div ref={logInModalRef} className="modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">登入</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="">帳號</label>
              <input
                type="text"
                className="form-control"
                {...register("email", { required: true })}
              />
              <label className="mt-1" htmlFor="">
                密碼
              </label>
              <input
                type="password"
                className="form-control"
                {...register("password", { required: true })}
              />
              <div className="d-flex justify-content-end">
                <input type="submit" className="btn btn-primary mt-3" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LogInModal;
