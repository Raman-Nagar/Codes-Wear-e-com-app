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
import Order from "../../models/order";
import { useRouter } from "next/router";
import { useEffect } from "react";

const viewOrder = ({ order }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (!token) {
      router.push("/adminlogin");
    }
  }, []);

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12} lg={12}>
          <BaseCard title="Order details">
            <Table
              aria-label="simple table"
              sx={{
                mt: 3,
                whiteSpace: "wrap",
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell >
                    <Typography variant="h6">Name</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography color="textSecondary" variant="h6">
                      {order.name}
                    </Typography>
                  </TableCell>

                  <TableCell >
                    <Typography variant="h6">Email</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography color="textSecondary" variant="h6">
                      {order.email}
                    </Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Phone</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography color="textSecondary" variant="h6">
                      {order.phone}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell >
                    <Typography variant="h6">Address</Typography>
                  </TableCell>
                  <TableCell
                    colSpan={5}
                    className="flex flex-wrap overflow-hidden"
                  >
                    <Typography color="textSecondary" variant="h6">
                      {order.address}
                    </Typography>
                  </TableCell>
                  
                </TableRow>
                <TableRow>
                  
                  <TableCell >
                    <Typography variant="h6">District</Typography>
                  </TableCell>
                  <TableCell
                    
                    className="flex flex-wrap overflow-hidden"
                  >
                    <Typography color="textSecondary" variant="h6">
                      {order.city}
                    </Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">State</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography color="textSecondary" variant="h6">
                      {order.state}
                    </Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Pincode</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography color="textSecondary" variant="h6">
                      {order.pincode}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell >
                    <Typography variant="h6">OrderId</Typography>
                  </TableCell>
                  <TableCell colSpan={2} >
                    <Typography color="textSecondary" variant="h6">
                      {order.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Transaction_id</Typography>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <Typography variant="h6" color="textSecondary">
                      {order.transactionid}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                <TableCell >
                    <Typography variant="h6">Amount</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography color="textSecondary" variant="h6">
                      {order.amount}
                    </Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Products</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography color="textSecondary" variant="h6">
                      {Object.keys(order.products).length}
                    </Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Payment Status</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography color="textSecondary" variant="h6">
                      {order.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </BaseCard>
            <BaseCard title="Products details">
            <Table
              aria-label="simple table"
              sx={{
                mt: 3,
                whiteSpace: "wrap",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell >
                    <Typography variant="h6">Product Name</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Quantity</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Size</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Color</Typography>
                  </TableCell>
                  <TableCell >
                    <Typography variant="h6">Price</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(order.products).map((product, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell >
                        <Typography color="textSecondary" variant="h6">
                          {order.products[product].name}
                        </Typography>
                      </TableCell>
                      <TableCell >
                        <Typography color="textSecondary" variant="h6">
                          {order.products[product].qty}
                        </Typography>
                      </TableCell>
                      <TableCell >
                        <Typography color="textSecondary" variant="h6">
                          {order.products[product].size}
                        </Typography>
                      </TableCell>
                      <TableCell >
                        <Typography color="textSecondary" variant="h6">
                          {order.products[product].variant}
                        </Typography>
                      </TableCell>
                      <TableCell >
                        <Typography color="textSecondary" variant="h6">
                          {order.products[product].price}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
  let order = await Order.findOne({ _id: context.query.orderid });
  return {
    props: { order: JSON.parse(JSON.stringify(order)) },
  };
}

export default viewOrder;
