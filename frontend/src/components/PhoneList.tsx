import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { withLoading } from "../hoc/Loading";
import { Phone } from "../types";
import { useDebounce } from "../hooks/useDebounce";

interface PhoneListProps {
  loading?: boolean;
  phones: Phone[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const PhoneListComponent = ({
  phones,
  searchQuery,
  onSearchChange,
}: PhoneListProps) => {
  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12 col-md-6 mx-auto">
          <div className="input-group search-input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search phones by name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {phones.length === 0 && searchQuery && (
        <div className="text-center py-5">
          <div className="text-muted">
            <i className="bi bi-search"></i>
            <p>No phones match your search for "{searchQuery}"</p>
            <p className="small">Try searching with different keywords</p>
          </div>
        </div>
      )}

      {phones.length > 0 && (
        <div
          id="phoneCarousel"
          className="carousel slide carousel-dark"
          data-bs-ride="carousel"
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
              >
                <div className="d-flex h-100 align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="mb-3">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/static/images/${phone.imageFileName}`}
                        alt={phone.name}
                        className="d-block mx-auto phone-list-image"
                      />
                    </div>
                    <div className="phone-info">
                      <h3 className="mb-2">{phone.name}</h3>
                      <p className="text-muted mb-2">{phone.manufacturer}</p>
                      <h4 className="text-primary mb-3">${phone.price}</h4>
                      <Link
                        to={`/phone/${phone.id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
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
      )}
    </div>
  );
};

const EnhancedPhoneList = withLoading(PhoneListComponent);

export const PhoneList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchPhones = useCallback(async (search?: string) => {
    setIsLoading(true);
    try {
      const url = new URL(`${process.env.REACT_APP_BACKEND_URL}/phones`);
      if (search) {
        url.searchParams.append("search", search);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch phones");
      }
      const phonesData = await response.json();
      setPhones(phonesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhones(debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchPhones]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <EnhancedPhoneList
      loading={isLoading}
      phones={phones}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
    />
  );
};
