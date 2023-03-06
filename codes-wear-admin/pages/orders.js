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
import BaseCard from "../src/components/baseCard/BaseCard";
import mongoose from "mongoose";
import Order from "../models/order";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

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
          <BaseCard title="All Order">
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
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Products
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Amount
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                    OrderId
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                    Transaction_id
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                    Address
                    </Typography>
                  </TableCell>
                  <TableCell align="center" >
                    <Typography color="textSecondary" variant="h6">
                      Pincode
                    </Typography>
                  </TableCell>
                  <TableCell align="center" >
                    <Typography color="textSecondary" variant="h6">
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell align="center" >
                    <Typography color="textSecondary" variant="h6">
                      Details
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell align="center">
                      <Typography variant="h6">{item.email.substr(0, 15)}..</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{Object.keys(item.products).length}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.amount}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.orderId}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.transactionid}</Typography>
                    </TableCell>
                    <TableCell align="center" className="flex flex-wrap overflow-hidden">
                      <Typography variant="h6">{item.address.substr(0, 10)}..</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.pincode}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.status}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Link href={`/order/${item._id}`}>
                        <Button
                          variant="contained"
                          mt={2}
                        >
                          Details
                        </Button>
                      </Link>
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
  let order = await Order.find({});

  return {
    props: { order: JSON.parse(JSON.stringify(order)) },
  };
}

export default viewOrder;
