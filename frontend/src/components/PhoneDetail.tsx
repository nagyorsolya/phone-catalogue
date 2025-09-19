import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { withLoading } from "../hoc/Loading";
import { Phone } from "../types";

interface PhoneDetailProps {
  loading?: boolean;
  phone: Phone | null;
  error: string | null;
}

const PhoneDetailComponent = ({ phone, error }: PhoneDetailProps) => {
  if (error) {
    return (
      <div className="error">
        <h2>Error: {error}</h2>
        <Link to="/">← Back to Phone List</Link>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="error">
        <h2>Phone not found</h2>
        <Link to="/">← Back to Phone List</Link>
      </div>
    );
  }

  return (
    <>
      <Link to="/" className="btn btn-primary m-4 d-block d-md-none">
        ← Back to Phone List
      </Link>

      <div className="d-flex justify-content-center align-items-center">
        <div className="card phone-detail-card d-flex flex-column flex-md-row justify-content-center align-items-center mx-4">
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/static/images/${phone.imageFileName}`}
            alt={phone.name}
            className="phone-detail-image"
          />

          <div className="card-body">
            <h1 className="card-title">{phone.name}</h1>
            <p className="manufacturer">by {phone.manufacturer}</p>
            <p className="price">${phone.price}</p>

            <div className="specifications">
              <h3>Specifications</h3>
              <ul>
                <li>
                  <strong>Screen:</strong> {phone.screen}
                </li>
                <li>
                  <strong>Processor:</strong> {phone.processor}
                </li>
                <li>
                  <strong>RAM:</strong> {phone.ram}GB
                </li>
                <li>
                  <strong>Color:</strong> {phone.color}
                </li>
              </ul>
            </div>

            <div className="description">
              <h3>Description</h3>
              <p className="card-text">{phone.description}</p>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/"
        className="btn btn-primary mt-4 mx-4 d-none d-md-inline-block"
      >
        ← Back to Phone List
      </Link>
    </>
  );
};

const EnhancedPhoneDetail = withLoading(PhoneDetailComponent);

export const PhoneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [phone, setPhone] = useState<Phone | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/phones/${id}`
        );
        if (!response.ok) {
          throw new Error("Phone not found");
        }
        const phoneData = await response.json();
        setPhone(phoneData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPhone();
    }
  }, [id]);

  return (
    <EnhancedPhoneDetail loading={isLoading} phone={phone} error={error} />
  );
};
