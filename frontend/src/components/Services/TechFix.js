import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;

// Get all suppliers
export const getAllSuppliers = async () => {
  try {
    const response = await axios.get(`${base_url}/suppliers/all`);
    console.log("Response data:", response.data); // Log the response data for debugging
    return response.data; // Return the entire response data
  } catch (error) {
    console.error("Error fetching suppliers:", error.message);
    return { suppliers: [] }; // Return an object with an empty array in case of error
  }
};

// add product to techfix
export const addTechFixProduct = async (product) => {
  try {
    const response = await axios.post(
      `${base_url}/products/techfix/add`,
      product,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Response:", response); // Log the entire response for debugging
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

// get all products from techfix
export const getTechFixProducts = async () => {
  try {
    const response = await axios.get(`${base_url}/product/techfix/all`);
    console.log("Response:", response); // Log the entire response for debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

//create quatation
export const createQuotation = async (quotation) => {
  try {
    const response = await axios.post(
      `${base_url}/quotations/techfix/create`,
      quotation
    );
    console.log("Response:", response); // Log the entire response for debugging
    return response.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
  }
};
