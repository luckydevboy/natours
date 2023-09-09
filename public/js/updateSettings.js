import axios from "axios";
import { showAlert } from "./alert";

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:3000/api/v1/users/update-my-password"
        : "http://127.0.0.1:3000/api/v1/users/update-me";

    const res = await axios.patch(url, data);

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully.`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
