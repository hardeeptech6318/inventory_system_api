const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRECT,
});



async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

// const storage = new multer.memoryStorage();
// const upload = multer({
//   storage,
// });


// to run locally create uploads folder and to store image in local folder uncomment below line and comment above line
const path = require("path");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });



async function connectToDb() {
  try {
    mongoose.connect(process.env.MONGODBURL, {});
    console.log("conncet to database");
  } catch (error) {
    console.log(error);
  }
}
connectToDb();

app.use(express.json());



const port = process.env.PORT || 5000;
var cors = require("cors");
app.use(cors());
const Addproduct = require("./schema/addproduct");

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/addproduct", upload.single("image"), async (req, res) => {
  try {
    const { name, category, description, quantity, selling_price, cost_price } =
      req.body;


      // to store image locally uncomment below
      const image = req.file.filename;


      // uncomment below line

    // const b64 = Buffer.from(req.file.buffer).toString("base64");
    // let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    // const cldRes = await handleUpload(dataURI);

    const formData = new Addproduct({
      name,
      category,
      description,
      quantity,
      selling_price,
      cost_price,
      // commet below line to run locally
      // image: cldRes.url,
      // uncomment below line
      image
    });

    // Save the document to the database
    const response = await formData.save();
    res
      .status(200)
      .json({ message: `Product added succesfully with id :${response._id}` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
});

app.get(`/allproduct`, async (req, res) => {
  try {
    const data = await Addproduct.find({});
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
});

app.delete(`/deleteproduct`, async (req, res) => {
  try {
    const { id } = req.query;
    const data = await Addproduct.deleteOne({ _id: id });
    
    res.status(200).json({ data });
  } catch (error) {
    
    res.status(400).json({ message: `Something went wrong` });
  }
});

app.get(`/productdetailsbyid`, async (req, res) => {
  try {
    const { id } = req.query;
    const data = await Addproduct.find({ _id: id });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
});

app.put("/addproduct", upload.single("image"), async (req, res) => {
  try {
    const {
      id,
      name,
      category,
      description,
      quantity,
      selling_price,
      cost_price,
    } = req.body;

    // comment below line
    // let cldRes;

    // if (req?.file) {
    //   const b64 = Buffer.from(req.file.buffer).toString("base64");
    //   let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    //   cldRes = await handleUpload(dataURI); // Set image if file is uploaded
    // }

      // uncomment below line and comment above line

    let image = null; // Initialize image variable

    if (req?.file) {
        image = req.file.filename; // Set image if file is uploaded
    }


    const formData = await Addproduct.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          category,
          description,
          quantity,
          selling_price,
          cost_price,
          // comment below line
          // ...(cldRes && { image: cldRes.url }),
          // uncomment below line
          ...(image && { image }),
        },
      },
      { new: true }
    );

    //   Check if the document is updated successfully
    if (!formData) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Save the document to the database
    const response = await formData.save();
    res
      .status(200)
      .json({ message: `Product modified successfully` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
});
