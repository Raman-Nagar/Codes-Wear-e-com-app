import { Grid, Stack, TextField, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseCard from "../../src/components/baseCard/BaseCard";
import mongoose from "mongoose";
import Products from "../../models/product";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import axios from "axios";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const UpdateData = ({ product }) => {
  const [image, setImage] = useState(product.img);
  const [title, setTitle] = useState(product.title);
  const [slug, setSlug] = useState(product.slug);
  const [category, setCategory] = useState(product.category);
  const [size, setSize] = useState(product.size);
  const [color, setColor] = useState(product.color);
  const [price, setPrice] = useState(product.price);
  const [availableQty, setAvailableQty] = useState(product.availableQty);
  const [description, setDescription] = useState(product.desc);
  const [texteditor, setTexteditor] = useState(product.texteditor);
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
    if (!title || !slug || !image || !description || !category || !size || !color || !price || !availableQty || !texteditor) {
      toast.warn("please fill data !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      
      const p = await axios.put(`http://localhost:3001/api/updateproducts`, [{_id:product._id, title, slug, desc:description, img:image, category, size, color, price, availableQty }], {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (p.status===200) {
        toast.success("products updated successfully !", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error("something went wrong !", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };
  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12} lg={12}>
          <BaseCard title="Update product">
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
              Update product
            </Button>
          </BaseCard>
        </Grid>
        <ToastContainer />
      </Grid>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  let product = await Products.findOne({ _id: context.query.id });

  return {
    props: { product: JSON.parse(JSON.stringify(product)) },
  };
}

export default UpdateData;
