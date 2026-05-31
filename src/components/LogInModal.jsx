import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js/dist/index.cjs";

function LogInModal({ logInModalRef }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  // Create a single supabase client for interacting with your database
  // const supabase = createClient( SUPABASE_KEY);

  async function onSubmit(data) {
    console.log(data);
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
