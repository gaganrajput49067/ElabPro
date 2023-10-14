import Spinner from "react-bootstrap/Spinner";

function Loading() {
  return (
    <div className="text-center">
      {/* <p>Loading...</p>
      <Spinner animation="border" role="status"></Spinner> */}
      <i class="fa fa-refresh fa-spin"></i>
    </div>
  );
}

export default Loading;
