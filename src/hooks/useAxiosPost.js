import { useState } from "react";
import axios from "axios";

const useAxiosPost = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access-token");

  const postRequest = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(url, data, {
        headers: {
          access: token,
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postRequest };
};

export default useAxiosPost;
