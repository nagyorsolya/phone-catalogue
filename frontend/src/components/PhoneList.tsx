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
    return <div>Loading phones...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div>
        {phones.map((phone) => (
          <Link to={`/phone/${phone.id}`} key={phone.id}>
            <div>
              <div>
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/static/images/${phone.imageFileName}`}
                  alt={phone.name}
                />
              </div>
              <div>
                <h3>{phone.name}</h3>
                <p>{phone.manufacturer}</p>
                <p>${phone.price}</p>
                <p>{phone.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
