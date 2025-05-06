import axios from "axios";

const destinationApi = axios.create({
  baseURL: "http://localhost:5010", // asigură-te că e portul corect!
  headers: {
    "Content-Type": "application/json",
  },
});

export default destinationApi;
