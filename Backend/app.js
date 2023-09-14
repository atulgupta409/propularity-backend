const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandle } = require("./middleware/errorMiddleware");
const userRoute = require("./routes/admin/userRoutes");
const countryRoute = require("./routes/admin/countryRoutes");
const stateRoute = require("./routes/admin/stateRoutes");
const imageUploadRouter = require("./routes/admin/imageUploadRoutes");
const cityRouter = require("./routes/admin/cityRoutes");
const microlocationRouter = require("./routes/admin/microLocationRoutes");
const amenityRouter = require("./routes/admin/amenitiesRoutes");
const propertytypeRouter = require("./routes/admin/propertyTypeRoutes");
const seoRouter = require("./routes/admin/seoRoutes");
const builderRouter = require("./routes/admin/builderRoutes");
const builderProjectRouter = require("./routes/admin/builderProjectRoutes");
const clientCityRoutes = require("./routes/client/cityRoutes");
const clientcountryRoutes = require("./routes/client/countryRoutes");
const clientMicrolocationRoutes = require("./routes/client/microlocationRoutes");
const clientStateRoutes = require("./routes/client/stateRoutes");
// const clientWorkSpaceRoutes = require("./routes/client/workSpaceRoutes");
const ourClientRouter = require("./routes/admin/ourClientRoutes");
const clientRouter = require("./routes/client/ourClientsRoutes");
const clientSeoRouter = require("./routes/client/seoRoutes");
// const clientBrandRouter = require("./routes/client/brandRoutes");
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const app = express();
const AWS = require("aws-sdk");
const contactFormRouter = require("./routes/client/contactFormRouter");
require("dotenv").config();
connectDB();


// -----------------aws-s3------------------------

const s3Client = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});
const corsOptions = {
  origin: 'http://admin.propularity.in',
};
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(contactFormRouter);
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allowedFormats = ["image/jpeg", "image/png", "image/svg+xml"];

app.post("/upload-image", upload.array("files"), (req, res) => {
  const promiseArray = [];
  req.files.forEach((file) => {
    // Check if the file format is allowed
    if (allowedFormats.includes(file.mimetype)) {
      const params = {
        Acl: "public-read",
        Bucket: process.env.BUCKET_NAME,
        Key: `image-${Date.now()}.${file.originalname.split(".").pop()}`,
        Body: file.buffer,
      };
      const putObjectPromise = s3Client.upload(params).promise();
      promiseArray.push(putObjectPromise);
    } else {
      console.log(
        `Skipping file ${file.originalname} due to unsupported format.`
      );
    }
  });

  Promise.all(promiseArray)
    .then((values) => {
      console.log(values);
      const urls = values.map((value) => value.Location);
      console.log(urls);
      res.send(urls);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get("/", (req, res) => {
  res.send("API is running for propularity...");
});

//-----------------aws-s3------------------------

app.use("/api/user", userRoute);
app.use("/api/allCountry", countryRoute);
app.use("/api/state", stateRoute);
app.use("/api/image", imageUploadRouter);
app.use("/api/city", cityRouter);
app.use("/api/microlocation", microlocationRouter);
app.use("/api/amenity", amenityRouter);
app.use("/api/propertytype", propertytypeRouter);
app.use("/api/seo", seoRouter);
app.use("/api/builder", builderRouter);
app.use("/api/project", builderProjectRouter);
app.use("/api/ourClient", ourClientRouter);
app.use("/api", clientCityRoutes);
app.use("/api/micro-location", clientMicrolocationRoutes);
app.use("/api", clientStateRoutes);
app.use("/api", clientcountryRoutes);
app.use("/api/client", clientRouter);
app.use("/api/seo", clientSeoRouter);
// app.use("/api/brands", clientBrandRouter);
app.use(notFound);
app.use(errorHandle);

app.listen(
  process.env.PORT,
  console.log(`server started on ${process.env.PORT}`)
);
