// Components Imports..................
import Header from "../Components/Header/Header";
import Brands from "../Components/Brands/Brands";
import FeaturesBooks from "../Components/FeaturesBooks/FeaturesBooks";
import BestSellingBook from "../Components/BestSellingBook/BestSellingBook";
import Quote from "../Components/Quote/Quote";

import { useEffect, useState } from "react";
import SpinnerLoader from "../Components/Spinner/spinne.jsx";
import { getBooksApi } from "../apis/apis.js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Token ${token}`,
  };
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!loginState) {
        navigate("/login");
      } 
      else{
        setLoading(true);
    const fetchData = async () => {
      try {
        const response = await getBooksApi(headers);
        setData(response.data.data.books);
        setLoading(false);
      } catch (err) {
        toast.error(err.response.data.detail);
        setLoading(false);
      }
    };

    fetchData();
      }
    
  }, []);

  return (
    <>
      <Header />
      <Brands />
      <FeaturesBooks title={"Featured Books"} books={data} />
      <BestSellingBook />
      <Quote />
      {loading && <SpinnerLoader />}
    </>
  );
}
