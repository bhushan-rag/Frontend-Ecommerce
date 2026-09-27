import React, { useEffect, useState } from "react";
import Hero from "../Components/Hero/Hero";
import Popular from "../Components/Popular/Popular";
import Offers from "../Components/Offers/Offers";
import NewCollections from "../Components/NewCollections/NewCollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";
import { backend_url } from "../config";

const Shop = () => {
  const [popular, setPopular] = useState([]);
  const [newcollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch(`${backend_url}/popularinwomen`)
      .then((res) => res.json())
      .then((data) => setPopular(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Failed to load popular products", error));
    fetch(`${backend_url}/newcollections`)
      .then((res) => res.json())
      .then((data) => setNewCollection(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Failed to load new collections", error));
  }, []);

  return (
    <div>
      <Hero />
      <Popular data={popular} />
      <Offers />
      <NewCollections data={newcollection} />
      <NewsLetter />
    </div>
  );
};

export default Shop;
