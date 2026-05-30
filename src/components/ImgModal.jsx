function ImgModal({ imgModalRef, src }) {
  return (
    <div ref={imgModalRef} className="modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="">
            <img className="w-100" src={src} alt="圖掛了"key={src}  />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImgModal;
