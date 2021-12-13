import { Category } from "../../Interfaces/Category";

const axios = require("axios");
const API_URL = "https://localhost:5001/api/v1.0";

export default class MockCategoryService {
    getAll = async () => {
      try {
        const response = await axios.get(`${API_URL}/category`);
        return Promise.resolve(response);
      } catch (error) {
        console.log(error);
        return null;
      }
    };
  
    add = async (category: Category) => {
      try {
        return await axios.post(`${API_URL}/category`, category);
      } catch (error) {
        console.log(error);
        return null;
      }
    };
  }
  