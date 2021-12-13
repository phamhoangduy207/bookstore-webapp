import { Product } from "../../Interfaces/Product";

const axios = require("axios");
const API_URL = "https://localhost:5001/api/v1.0";

export default class MockProductService {
  getAll = async () => {
    try {
      const response = await axios.get(`${API_URL}/product`);
      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  add = async (product: Product) => {
    try {
      return await axios.post(`${API_URL}/product`, product);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
