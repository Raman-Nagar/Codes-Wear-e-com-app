import connectDB from "../../server/conection/connectDB"
import Contact from "../../server/models/contactreq";
import NextCors from "nextjs-cors";
import nodemailer from "nodemailer"

 async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === "POST") {

    const data = req.body;

    if(!data.name || !data.email || !data.number || !data.subject || !data.message || !data.ip ){
        res.status(400).json({ message: "please fill data !" });
    }else{
        try {
            // console.log(data)
            const {name, email, number, subject, message, ip} = data;

            const CONTACT_MESSAGE_FIELDS = {
                name:"NAME",
                email:"EMAIL",
                number:"NUMBER",
                subject:"SUBJECT",
                message:"MESSAGE",
                ip:"IP ADD."
            }

            const stringData = Object.entries(data).reduce((str, [key, val])=>{
              return  str += `${CONTACT_MESSAGE_FIELDS[key]}${" "} : ${" "}  \n${val}\n \n` 
            }, "")
            const htmlData = Object.entries(data).reduce((str, [key, val])=>{
               return str += `<div style="display: flex; align-items: center; gap: 3rem">
                <h3> ${CONTACT_MESSAGE_FIELDS[key]} ${" "}</h3>
                <p> ${" "} : ${" "} </p>
                <p>${" "} ${val} </p>
              </div>` 
            }, "")

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: "ramannagar08082000@gmail.com", // generated ethereal user
            pass:"wolndopzyvsuarfn",
        }
    }) 
    const mailOptions = {
        from:"ramannagar08082000@gmail.com",
        to: "ramannagar08082000@gmail.com",
        subject:`Sending Email For ${subject}, by ${email}`,
        text:stringData,
        html:`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>user data</title>
          </head>
          <body>
            <div
              style="
                width: 50vw;
                margin: 5rem auto;">
              <div>
                <h1>New Contact Message</h1>
              </div>
              <div
                style="
                  border: 1px solid;
                  padding: 2rem 5rem;
                "
              >
                ${htmlData}
              </div>
            </div>
          </body>
        </html>
        `
    }

    transporter.sendMail(mailOptions, async (error,info)=>{
        if(error){
            console.log("error",error);
            res.status(401).json({status:401,message:"email not send"})
        }else{

            const contact = new Contact({name, email, number, subject, message, ip});
          
              const result = await contact.save();
          
            //   res.status(201).json({ result });
          
            console.log("Email sent",info.response);
            res.status(201).json({status:201, message:"Email sent Succsfully"})
        }
    })
    //   res.status(200).json({ message: "Hello NextJs Cors!" });
    } catch (error) {
            console.log(error)
    }
}
  }else{
    res.status(400).json({ message: "bad request !" });
  }
}

export default connectDB(handler);
