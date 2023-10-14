import Spinner from "react-bootstrap/Spinner";

function Loading() {
  return (
    <div className="text-center">
      <Spinner animation="border" role="status"></Spinner>
    </div>
  );
}

export default Loading;
