import React from "react";

const Footer = () => {
  return (
    <div className="text-center bg-light py-4">
      <h6>Welcome my chanel forum-dev-H</h6>
      <div>
        <a
          href="https://www.facebook.com/huy08012001/"
          target="_blank"
          rel="noreferrer"
          className="mb-2"
          style={{ marginRight: "10px" }}
        >
          <i className="fab fa-facebook-square"></i>
        </a>
        <a
          href="https://github.com/L-E-H-U-Y-0801"
          target="_blank"
          rel="noreferrer"
          className="mb-2 "
          style={{ marginLeft: "10px" }}
        >
          <i class="fa fa-github" aria-hidden="true"></i>
        </a>
      </div>
      <p> Copyright &copy; by Dev-H 2021</p>
    </div>
  );
};

export default Footer;
