import React from "react";

function Preview({ blogO }) {
  return (
    <div>
      <h6>Preview</h6>
      <div className="card mb-3 p-2" style={{ maxWidth: "540px" }}>
        <div className="row g-0 d-flex align-items-center">
          <div className="col-md-4">
            <img
              src={blogO.thumbnail && URL.createObjectURL(blogO.thumbnail)}
              className="img-fluid rounded-start"
              alt=""
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{blogO.title}</h5>
              <p className="card-text">{blogO.description}</p>
              <p className="card-text">
                <small className="text-muted">{blogO.category}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
