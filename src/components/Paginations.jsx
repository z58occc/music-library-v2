import { useEffect, useState } from "react";
import _ReactPaginate from "react-paginate";
const ReactPaginate = _ReactPaginate.default;


function Paginations({ itemsPerPage, newData, setCurrentData }) {
  // Example items, to simulate fetching from another resources.
  const items = Array.from({ length: newData.length }, (_, i) => i + 1);

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  // setCurrentData(newData.slice(itemOffset, endOffset));
  useEffect(() => {
    setCurrentData(newData.slice(itemOffset, endOffset));
  }, [newData]);

  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };
  useEffect(() => {
    setCurrentData(newData.slice(itemOffset, endOffset));
  }, [itemOffset]);
  return (
    <>
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export default Paginations;
