import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;

// Get all suppliers
export const getAllSuppliers = async () => {
  try {
    const response = await axios.post(`${base_url}/auth/getAllSuppliers`);
    console.log("Response:", response); // Log the entire response for debugging
    const data = response.data.data;

    if (!data) {
      throw new Error("No data found in response");
    }

    const suppliers = data.map((supplier) => ({
      id: supplier._id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    }));

    return suppliers;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
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
    const response = await axios.get(`${base_url}/products/techfix/all`);
    console.log("Response:", response); // Log the entire response for debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

//create quatation
export const createQuotation = async (quotation) => {
  try {
    const response = await axios.post(`${base_url}/quotations/techfix/create`, quotation);
    console.log("Response:", response); // Log the entire response for debugging
    return response.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
  }
};
