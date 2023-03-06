import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseCard from "../../src/components/baseCard/BaseCard";
import mongoose from "mongoose";
import Products from "../../models/product";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";

const viewProducts = ({ products }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (!token) {
      router.push("/adminlogin");
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const product = await fetch(`http://localhost:3001/api/${id}`, {
        method: "DELETE",
      });
      console.log(product);
      if (product.data.succes) {
        toast.success("Product deleted successfully !", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error("something went wrong !", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12} lg={12}>
          <BaseCard title="All products">
            <Link href={`/addproduct`} className="flex justify-end">
              <Button variant="contained" style={{ float: "right" }}>
                Add Product
              </Button>
            </Link>
            <Table
              aria-label="simple table"
              sx={{
                mt: 3,
                whiteSpace: "wrap",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Title
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Image
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                    Category
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Size
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Color
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Price
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                    AvailableQty
                    </Typography>
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    <Typography color="textSecondary" variant="h6">
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell align="center">
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "600",
                        }}
                      >
                        {product.title}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        <Image
                          src={product.img}
                          width="100"
                          height="70"
                          alt=""
                        />
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                    >
                      <Typography variant="h6">
                        {product.category}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                    >
                      <Typography variant="h6">
                        {product.size}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                    >
                      <Typography variant="h6">
                        {product.color}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                    >
                      <Typography variant="h6">
                        {product.price}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                    >
                      <Typography variant="h6">
                        {product.availableQty}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Link href={`/allproducts/${product._id}`}>
                        <Button
                          variant="contained"
                          mt={2}
                        >
                          Edite
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        mt={2}
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
  let products = await Products.find({});

  return {
    props: { products: JSON.parse(JSON.stringify(products)) },
  };
}

export default viewProducts;
