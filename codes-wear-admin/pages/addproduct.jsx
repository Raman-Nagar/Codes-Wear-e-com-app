import { Grid, Stack, TextField, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseCard from "../src/components/baseCard/BaseCard";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [availableQty, setAvailableQty] = useState("");
  const [description, setDescription] = useState("");
  const [texteditor, setTexteditor] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (!token) {
      router.push("/adminlogin");
    }
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      setImage(e.target.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if ( !title || !slug || !image || !description || !category || !size || !color || !price || !availableQty) {
      toast.warn("please fill data !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {

      const product = await axios.post(`http://localhost:3001/api/addproducts`, [{ title, slug, desc:description, img:image, category, size, color, price, availableQty }], {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (product.status===200) {
        toast.success("Product ADD successfully !", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error("invalid user !", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12} lg={12}>
          <BaseCard title="Add a Product">
            <Stack spacing={3}>
              <Stack spacing={3} direction="row">
                <TextField
                  id="outlined-basic"
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  id="outlined-basic"
                  label="Slug"
                  variant="outlined"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <TextField
                  id="outlined-basic"
                  label="Category"
                  variant="outlined"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Stack>
              <input
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-gray-100 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="file"
                id="formFileDisabled"
                name="photo"
                onChange={handleImage}
                multiple
              />

              <Stack spacing={3} direction="row">
                <TextField
                  id="outlined-basic"
                  label="Color"
                  variant="outlined"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <TextField
                  id="outlined-basic"
                  label="size"
                  variant="outlined"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
                <TextField
                  id="outlined-basic"
                  label="Price"
                  variant="outlined"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                  id="outlined-basic"
                  label="Available Quantity"
                  variant="outlined"
                  value={availableQty}
                  onChange={(e) => setAvailableQty(e.target.value)}
                />
              </Stack>
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
            <br />
            <QuillNoSSRWrapper
              theme="snow"
              onChange={(e) => setTexteditor(e)}
            />
            <Button variant="contained" mt={2} onClick={handleSubmit}>
              Add Product
            </Button>
          </BaseCard>
        </Grid>
        <ToastContainer />
      </Grid>
    </>
  );
};

export default AddProduct;
