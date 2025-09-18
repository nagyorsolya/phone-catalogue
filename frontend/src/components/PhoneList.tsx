import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Phone {
  id: number;
  name: string;
  manufacturer: string;
  description: string;
  color: string;
  price: number;
  imageFileName: string;
  screen: string;
  processor: string;
  ram: number;
}
export const PhoneList = () => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/phones`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch phones");
        }
        const phonesData = await response.json();
        setPhones(phonesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPhones();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-fluid px-3 py-3" style={{ minHeight: "100vh" }}>
      <div
        id="phoneCarousel"
        className="carousel slide carousel-dark"
        data-bs-ride="carousel"
        style={{ minHeight: "90vh" }}
      >
        <div className="carousel-indicators">
          {phones.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#phoneCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {phones.map((phone, index) => (
            <div
              key={phone.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              style={{ minHeight: "90vh" }}
            >
              <div className="d-flex align-items-center h-100">
                <div className="row align-items-center g-3 w-100">
                  <div className="col-12 col-md-6 text-center">
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/static/images/${phone.imageFileName}`}
                      alt={phone.name}
                      className="d-block mx-auto"
                      style={{
                        maxHeight: "300px",
                        maxWidth: "200px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="carousel-caption-custom text-dark text-center text-md-start p-3 pb-5">
                      <h3 className="mb-2">{phone.name}</h3>
                      <p className="text-muted mb-2">{phone.manufacturer}</p>
                      <h4 className="text-primary mb-3">${phone.price}</h4>
                      <Link
                        to={`/phone/${phone.id}`}
                        className="btn btn-primary mb-4"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#phoneCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#phoneCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};
