import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Pagination({ total }) {
  const [page, setPage] = useState(1);
  const history = useHistory();
  const array = [...Array(total)].map((_, i) => i + 1);

  const isActive = (index) => {
    if (index === Number(page)) return "active";
    return "";
  };
  const handlePagination = (num) => {
    history.push(`?page=${num}`);
  };

  useEffect(() => {
    const num = history.location.search.slice(6) || 1;
    setPage(num);
  }, [history.location.search]);

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {page > 1 && (
          <li
            className="page-item"
            onClick={() => handlePagination(Number(page) - 1)}
          >
            <span className="page-link" aria-label="Previous">
              <span aria-hidden="true">«</span>
            </span>
          </li>
        )}

        {array.map((i, index) => {
          if (index >= 3) return "";

          return (
            <li
              className={`page-item  ${isActive(i)}`}
              key={index}
              onClick={() => handlePagination(i)}
            >
              <span className="page-link">{i}</span>
            </li>
          );
        })}
        {array.length >= 4 &&
          (array.length === 4 ? (
            <li className="page-item">
              <span className="page-link">4</span>
            </li>
          ) : (
            <span style={{ margin: "0 10px", fontSize: "35px" }}>
              <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
            </span>
          ))}
        {array.length > 4 && (
          <li
            className={`page-item  ${isActive(array[array.length - 1])}`}
            onClick={() => handlePagination(array[array.length - 1])}
          >
            <span className="page-link">{array[array.length - 1]}</span>
          </li>
        )}

        {page < total && (
          <li
            className="page-item"
            onClick={() => handlePagination(Number(page) + 1)}
          >
            <span className="page-link" aria-label="Next">
              <span aria-hidden="true">»</span>
            </span>
          </li>
        )}
        {total > 5 && (
          <li
            className="page-item"
            style={{ marginLeft: "20px", marginTop: "-2px" }}
          >
            <span className="page-link" aria-label="Next">
              <input
                style={{ width: "40px" }}
                type="number"
                onChange={(e) => setPage(e.target.value)}
                min="1"
                max={`${total}`}
              />
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handlePagination(page)}
              >
                Enter
              </button>
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Pagination;
