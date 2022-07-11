import { useSelector } from "react-redux";

import Loading from "./loading";
import Toast from "./toast";

const Alert = () => {
  const { alert } = useSelector((state) => state);

  return (
    <div>
      {alert.loading && <Loading />}

      {alert.notify.errors && (
        <Toast title="Errors" body={alert.notify.errors} bgColor="danger" />
      )}

      {alert.notify.success && (
        <Toast title="Success" body={alert.notify.success} bgColor="success" />
      )}
    </div>
  );
};

export default Alert;

export const showErrMsg = (msg) => {
  return <div className="errMsg">{msg}</div>;
};

export const showSuccessMsg = (msg) => {
  return <div className="successMsg">{msg}</div>;
};
