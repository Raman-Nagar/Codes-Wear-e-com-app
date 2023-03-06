import * as fs from "fs";

export default function handler(req, res) {

    console.log(req.body);
    fs.readFile("server/login.json", "utf-8", (err, data) => {
        if (err) {
            res.status(400).json({ error: "Internal server error" })
        }
        res.status(200).json({ message: "successfully get admin", result: JSON.parse(data) })
    })
} 
