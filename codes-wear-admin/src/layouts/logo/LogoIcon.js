import React from "react";
import { Link } from "@mui/material";
import Image from "next/image";
import logo from '../../../assets/images/logos/Logo-2.jpeg'

const LogoIcon = () => {
  return (
    <Link href="/">
      <Image src={logo} width="200px" height="50px" alt={"LogoDark"} />
      {/* Admin  */}
    </Link>
  );
};

export default LogoIcon;
