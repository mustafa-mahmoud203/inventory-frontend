// Import NotFound.css.....................
import "./NotFound.css";

// Import React Link.....................
import { Link } from "react-router-dom";

export default function NotFound({ data }) {
  const rootPath = window.location.origin;
  
  return (
    <section className="Not-Found">
      <div className="container not-found-container">
        <h1>{data.status}</h1>
        <h3>{data.message}</h3>
        {/* Opps, This Page Not Found */}

        <Link to={`${rootPath}/${data.directory}`} className="btn btn-border">
          Go To Home Page
        </Link>
      </div>
    </section>
  );
}
