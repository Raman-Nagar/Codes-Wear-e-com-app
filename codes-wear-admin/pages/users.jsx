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
import User from "../models/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

const viewUser = ({ user }) => {
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
          <BaseCard title="All Users">
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
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                      Phone
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                    Address
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="textSecondary" variant="h6">
                    Pincode
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell align="center">
                      <Typography variant="h6">{item.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.email}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.phone}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.address}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6">{item.pincode}</Typography>
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
  let user = await User.find({});

  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
}

export default viewUser;
