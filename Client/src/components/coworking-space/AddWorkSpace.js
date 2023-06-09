import React, { useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import Multiselect from "multiselect-react-dropdown";
import { GpState } from "../../context/context";
import ImageUpload from "../../ImageUpload";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { useNavigate } from "react-router-dom";
import { config, postConfig } from "../../services/Services";

function AddWorkSpace() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const toast = useToast();
  const [updateTable, setUpdateTable] = useState(false);
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [duration, setDuration] = useState("");
  const [selectedval1, setSelectedval1] = useState([]);
  const [selectedval2, setSelectedval2] = useState([]);
  const [selectedval3, setSelectedval3] = useState([]);
  const [selectedval4, setSelectedval4] = useState([]);
  const [selectedval5, setSelectedval5] = useState([]);
  const [selectedval6, setSelectedval6] = useState([]);

  const navigate = useNavigate();

  const [checkedAmenities, setCheckedAmenities] = useState([]);

  const [microlocationId, setMicrolocationId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [coSpace, setCoSpace] = useState({
    brand: "",
    name: "",
    slug: "",
    title: "",
    description: "",
    url: "",
    keywords: "",
    robots: "",
    twitterTitle: "",
    twitterDescription: "",
    graphTitle: "",
    graphDescription: "",
    address: "",
    country: "",
    state: "",
    city: "",
    microLocation: "",
    longitude: "",
    lattitude: "",
    postalCode: "",
    amenity: "",
    images: [],
    seats: "",
    price: "",
    category: "",
  });

  const [open, setOpen] = useState({
    fullOpen1: false,
    isClose1: false,
    fullOpen2: false,
    isClose2: false,
    fullOpen3: false,
    isClose3: false,
  });
  const { fullOpen1, isClose1, fullOpen2, isClose2, fullOpen3, isClose3 } =
    open;
  const [options, setOptions] = useState([
    { name: "01:00 AM" },
    { name: "01:15 AM" },
    { name: "01:30 AM" },
    { name: "01:45 AM" },
    { name: "02:00 AM" },
    { name: "02:15 AM" },
    { name: "02:30 AM" },
    { name: "02:45 AM" },
    { name: "03:00 AM" },
    { name: "03:15 AM" },
    { name: "03:30 AM" },
  ]);

  const openFullHoursHandler = (e) => {
    if (e.target.checked && e.target.value === "mon-fri") {
      setOpen({ ...open, fullOpen1: true });
    } else if (!e.target.checked && e.target.value === "mon-fri") {
      setOpen({ ...open, fullOpen1: false });
    } else if (e.target.checked && e.target.value === "sat") {
      setOpen({ ...open, fullOpen2: true });
    } else if (!e.target.checked && e.target.value === "sat") {
      setOpen({ ...open, fullOpen2: false });
    } else if (e.target.checked && e.target.value === "sun") {
      setOpen({ ...open, fullOpen3: true });
    } else if (!e.target.checked && e.target.value === "sun") {
      setOpen({ ...open, fullOpen3: false });
    }
  };

  const closeHandler = (e) => {
    if (e.target.checked && e.target.value === "mon-fri-close") {
      setOpen({ ...open, isClose1: true });
    } else if (!e.target.checked && e.target.value === "mon-fri-close") {
      setOpen({ ...open, isClose1: false });
    } else if (e.target.checked && e.target.value === "sat") {
      setOpen({ ...open, isClose2: true });
    } else if (!e.target.checked && e.target.value === "sat") {
      setOpen({ ...open, isClose2: false });
    } else if (e.target.checked && e.target.value === "sun") {
      setOpen({ ...open, isClose3: true });
    } else if (!e.target.checked && e.target.value === "sun") {
      setOpen({ ...open, isClose3: false });
    }
  };

  const createPlans = () => {
    const newRow = {
      id: plans.length + 1,
      category: "",
      price: "",
      duration: "",
    };
    setPlans((prevRows) => [...prevRows, newRow]);
  };

  const removePlan = (id) => {
    setPlans((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  const onChangePlanHandler = (e, id) => {
    const { name, value } = e.target;
    setPlans((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const onChangePlanHandler2 = (e, id) => {
    const { value } = e.target;
    setPlans((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, duration: value } : row))
    );
  };

  const handleInputPlanChange = (e, id) => {
    const { name, value } = e.target;
    setPlans((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  let footer_descript_value = convertToRaw(editorState.getCurrentContent())
    .blocks[0].text;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoSpace({
      ...coSpace,
      [name]: value,
    });
  };
  const getCityByState = async () => {
    try {
      setLoading(true);

      await axios
        .post("/api/city/citybystate", { state_id: stateId }, config)
        .then((result) => {
          console.log(result.data);
          setCities(result.data);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getStateByCountry = async () => {
    try {
      setLoading(true);

      await axios
        .post("/api/state/statesbycountry", { country_id: countryId }, config)
        .then((result) => {
          console.log(result.data);
          setStates(result.data);
        });
      setLoading(false);
      // setStates(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getMicrolocationByCity = async () => {
    try {
      setLoading(true);

      await axios
        .post("/api/microlocation/microbycity", { city_id: cityId }, config)
        .then((result) => {
          console.log(result.data);
          setMicrolocations(result.data);
        });
      setLoading(false);
      // setStates(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCountry = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/allCountry/countries", config);
      setLoading(false);
      setCountry(data.country);
    } catch (error) {
      console.log(error);
    }
  };
  const getBrandsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/brand/brands", config);
      setLoading(false);
      setBrands(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAmenities = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/amenity/amenities", config);
      setLoading(false);
      setAmenities(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCategory = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "/api/propertyType/propertyTypes",
        config
      );
      setLoading(false);
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeHandler = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option = el.getAttribute("id");
    const { name, value } = e.target;
    setCoSpace({
      ...coSpace,
      [name]: value,
    });
    setCountryId(option);
  };
  const onChangeHandler1 = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option1 = el.getAttribute("id");
    const { name, value } = e.target;
    setCoSpace({
      ...coSpace,
      [name]: value,
    });
    setStateId(option1);
  };
  const onChangeHandler2 = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option2 = el.getAttribute("id");
    const { name, value } = e.target;
    setCoSpace({
      ...coSpace,
      [name]: value,
    });
    setCityId(option2);
  };
  const onChangeHandler3 = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option3 = el.getAttribute("id");
    const { name, value } = e.target;
    setCoSpace({
      ...coSpace,
      [name]: value,
    });
    setMicrolocationId(option3);
  };
  const onChangeHandler4 = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option4 = el.getAttribute("id");
    const { name, value } = e.target;
    setCoSpace({
      ...coSpace,
      [name]: value,
    });
    setBrandId(option4);
  };
  const previewFile = (data) => {
    const allimages = images;
    setImages(allimages.concat(data));
  };

  const uploadFile = (files) => {
    const formData = new FormData();
    setProgress(0);
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });
    axios
      .post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setProgress(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      })
      .then((res) => {
        previewFile(res.data);
        // setTimeout(() => {
        //   setProgress(0);
        // }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("sshiva");
  };
  const handleSaveWorkSpace = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/workSpace/workSpaces",
        {
          name: coSpace.name,
          description: footer_descript_value,
          images: images,
          amenties: checkedAmenities,
          seo: {
            title: coSpace.title,
            description: coSpace.description,
            robots: coSpace.robots,
            keywords: coSpace.keywords,
            url: coSpace.url,
            status: false,
            twitter: {
              title: coSpace.twitterTitle,
              description: coSpace.twitterDescription,
            },
            open_graph: {
              title: coSpace.graphTitle,
              description: coSpace.graphDescription,
            },
          },
          location: {
            address: coSpace.address,
            country: countryId,
            state: stateId,
            city: cityId,
            micro_location: microlocationId,
            latitude: coSpace.lattitude,
            longitude: coSpace.longitude,
          },
          no_of_seats: coSpace.seats,
          hours_of_operation: {
            monday_friday: {
              // from: selectedval1[0].name || "",
              // to: selectedval2[0].name || "",
              // is_closed: open.isClose1,
              is_open_24: open.fullOpen1,
            },
            saturday: {
              // from: selectedval3[0].name || "",
              // to: selectedval4[0].name || "",
              // is_closed: open.isClose2,
              is_open_24: open.fullOpen2,
            },
            sunday: {
              // from: selectedval5[0].name || "",
              // to: selectedval6[0].name || "",
              // is_closed: open.isClose3,
              is_open_24: open.fullOpen3,
            },
          },
          plans,

          // status,
          brand: brandId,
          slug: coSpace.slug,
        },
        postConfig
      );
      setCoSpace({
        brand: "",
        name: "",
        slug: "",
        title: "",
        description: "",
        url: "",
        keywords: "",
        robots: "",
        twitterTitle: "",
        twitterDescription: "",
        graphTitle: "",
        graphDescription: "",
        address: "",
        country: "",
        state: "",
        city: "",
        microLocation: "",
        longitude: "",
        lattitude: "",
        postalCode: "",
        amenity: "",
        images: [],
        seats: "",
      });
      setUpdateTable((prev) => !prev);
      navigate("/coworking-space");
      toast({
        title: "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Saved the Space",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleCheckboxChange = (event) => {
    const checkedAmenityId = event.target.value;
    const isChecked = event.target.checked;

    // Update the array of checked checkbox IDs
    if (isChecked) {
      setCheckedAmenities((prevCheckedAmenities) => [
        ...prevCheckedAmenities,
        checkedAmenityId,
      ]);
    } else {
      setCheckedAmenities((prevCheckedAmenities) =>
        prevCheckedAmenities.filter((id) => id !== checkedAmenityId)
      );
    }
  };
  const handleSelect1 = (selectedList, selectedItem) => {
    setSelectedval1(selectedList);
  };
  const handleSelect2 = (selectedList, selectedItem) => {
    setSelectedval2(selectedList);
  };
  const handleSelect3 = (selectedList, selectedItem) => {
    setSelectedval3(selectedList);
  };
  const handleSelect4 = (selectedList, selectedItem) => {
    setSelectedval4(selectedList);
  };
  const handleSelect5 = (selectedList, selectedItem) => {
    setSelectedval5(selectedList);
  };
  const handleSelect6 = (selectedList, selectedItem) => {
    setSelectedval6(selectedList);
  };

  useEffect(() => {
    getCountry();
    getBrandsData();
    getAmenities();
    getCategory();
  }, []);

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form style={{ textAlign: "left" }} onSubmit={handleSaveWorkSpace}>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div
                  style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                >
                  <select
                    className="form-select"
                    name="brand"
                    aria-label="Default select example"
                    value={coSpace.brand}
                    onChange={onChangeHandler4}
                  >
                    <option>Select a brand</option>
                    {brands?.map((brand) => (
                      <option id={brand._id} key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <input
                  className="property-input"
                  type="text"
                  placeholder="Name*"
                  name="name"
                  value={coSpace.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </div>
            </div>
            <h4>Slug Update</h4>
            <div className="row">
              <div className="col-md-12">
                <input
                  className="property-input"
                  type="text"
                  placeholder="Slug"
                  value={coSpace.slug}
                  name="slug"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <h4>SEO Details</h4>
            <div className="row">
              <div className="col-md-3">
                <input
                  type="text"
                  className="property-input"
                  placeholder="Title"
                  name="title"
                  value={coSpace.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="property-input"
                  placeholder="Description"
                  name="description"
                  value={coSpace.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="property-input"
                  placeholder="Robots"
                  name="robots"
                  value={coSpace.robots}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <input
                  type="text"
                  className="property-input"
                  placeholder="Keywords"
                  name="keywords"
                  value={coSpace.keywords}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="property-input"
                  placeholder="Url"
                  value={coSpace.url}
                  onChange={handleInputChange}
                  name="url"
                />
              </div>
              <div className="col-md-3">
                <div
                  style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={coSpace.status}
                    name="status"
                    onChange={handleInputChange}
                  >
                    <option>Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="Twitter title"
                  className="property-input"
                  name="twitterTitle"
                  value={coSpace.twitterTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="Twitter description"
                  name="twitterDescription"
                  value={coSpace.twitterDescription}
                  onChange={handleInputChange}
                  className="property-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="Open graph title"
                  className="property-input"
                  name="graphTitle"
                  value={coSpace.graphTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="Open graph description"
                  className="property-input"
                  value={coSpace.graphDescription}
                  name="graphDescription"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <h4>Location</h4>
            <div className="row">
              <div className="col-md-12">
                <textarea
                  cols="100"
                  rows="2"
                  className="property-input"
                  placeholder="Address*"
                  name="address"
                  value={coSpace.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="col-md-3">
                <div
                  style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={coSpace.country}
                    onChange={onChangeHandler}
                    name="country"
                    onClick={getStateByCountry}
                    required
                  >
                    <option>Select a country*</option>
                    {country?.map((countryElem) => (
                      <option
                        id={countryElem._id}
                        key={countryElem._id}
                        value={countryElem.name}
                      >
                        {countryElem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={coSpace.state}
                    name="state"
                    onChange={onChangeHandler1}
                    onClick={getCityByState}
                    required
                  >
                    <option>Select a state*</option>
                    {states?.map((stateElem) => (
                      <option
                        id={stateElem._id}
                        key={stateElem._id}
                        value={stateElem.name}
                      >
                        {stateElem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={coSpace.city}
                    onChange={onChangeHandler2}
                    onClick={getMicrolocationByCity}
                    name="city"
                    required
                  >
                    <option>Select a city*</option>
                    {cities?.map((cityElem) => (
                      <option
                        id={cityElem._id}
                        key={cityElem._id}
                        value={cityElem.name}
                      >
                        {cityElem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div
                  style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="microLocation"
                    value={coSpace.microLocation}
                    onChange={onChangeHandler3}
                    required
                  >
                    <option>Select a microlocation*</option>
                    {microlocations?.map((microLocation) => (
                      <option
                        id={microLocation._id}
                        key={microLocation._id}
                        value={microLocation.name}
                      >
                        {microLocation.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="Lattitude*"
                  className="property-input"
                  name="lattitude"
                  value={coSpace.lattitude}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="Longitude*"
                  className="property-input"
                  value={coSpace.longitude}
                  name="longitude"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <input
                  type="text"
                  className="property-input"
                  placeholder="Postel code"
                  name="postalCode"
                  value={coSpace.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <h4>Amenities</h4>
            <div className="row">
              <div className="form-check">
                {amenities?.map((amenity) => (
                  <div key={amenity._id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={amenity._id}
                      id="flexCheckDefault"
                      name="amenity"
                      onChange={handleCheckboxChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <h4>Images</h4>
            <div className="row">
              <ImageUpload
                images={images}
                setImages={setImages}
                progress={progress}
                setProgress={setProgress}
                uploadFile={uploadFile}
              />
            </div>
            <div className="row">
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="No. of seats*"
                  className="property-input"
                  name="seats"
                  value={coSpace.seats}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <h4>Hours of operation</h4>

            <div className="row">
              <div className="col-md-3">Monday-Friday</div>
              {fullOpen1 === false && isClose1 === false && (
                <div className="col-md-2">
                  <div style={{ borderBottom: "1px solid gray" }}>
                    <Multiselect
                      options={options}
                      displayValue="name"
                      singleSelect
                      placeholder="From*"
                      onSelect={handleSelect1}
                      onRemove={handleSelect1}
                    />
                  </div>
                </div>
              )}
              {fullOpen1 === false && isClose1 === false && (
                <div className="col-md-2">
                  <div style={{ borderBottom: "1px solid gray" }}>
                    <Multiselect
                      options={options}
                      displayValue="name"
                      singleSelect
                      placeholder="To*"
                      onSelect={handleSelect2}
                      onRemove={handleSelect2}
                    />
                  </div>
                </div>
              )}
              {isClose1 === false && (
                <div className="col-md-3" style={{ paddingTop: "8px" }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="mon-fri"
                      id="flexCheckDefault"
                      onChange={openFullHoursHandler}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Open 24 Hours
                    </label>
                  </div>
                </div>
              )}
              {fullOpen1 === false && (
                <div className="col-md-2" style={{ paddingTop: "8px" }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="mon-fri-close"
                      id="flexCheckDefault"
                      onChange={closeHandler}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Closed
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-md-2">Saturday</div>
              {fullOpen2 === false && isClose2 === false && (
                <div className="col-md-2">
                  <div style={{ borderBottom: "1px solid gray" }}>
                    <Multiselect
                      options={options}
                      onSelect={handleSelect3}
                      onRemove={handleSelect3}
                      displayValue="name"
                      singleSelect
                      placeholder="From*"
                    />
                  </div>
                </div>
              )}
              {fullOpen2 === false && isClose2 === false && (
                <div className="col-md-2">
                  <div style={{ borderBottom: "1px solid gray" }}>
                    <Multiselect
                      options={options}
                      onSelect={handleSelect4}
                      onRemove={handleSelect4}
                      displayValue="name"
                      singleSelect
                      placeholder="To*"
                    />
                  </div>
                </div>
              )}
              {isClose2 === false && (
                <div className="col-md-3" style={{ paddingTop: "8px" }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="sat"
                      id="flexCheckDefault"
                      onChange={openFullHoursHandler}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Open 24 Hours
                    </label>
                  </div>
                </div>
              )}
              {fullOpen2 === false && (
                <div className="col-md-2" style={{ paddingTop: "8px" }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="sat"
                      id="flexCheckDefault"
                      onChange={closeHandler}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Closed
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-md-2">Sunday</div>
              {fullOpen3 === false && isClose3 === false && (
                <div className="col-md-2">
                  <div style={{ borderBottom: "1px solid gray" }}>
                    <Multiselect
                      options={options}
                      onSelect={handleSelect5}
                      onRemove={handleSelect5}
                      displayValue="name"
                      singleSelect
                      placeholder="From*"
                    />
                  </div>
                </div>
              )}
              {fullOpen3 === false && isClose3 === false && (
                <div className="col-md-2">
                  <div style={{ borderBottom: "1px solid gray" }}>
                    <Multiselect
                      options={options}
                      displayValue="name"
                      onSelect={handleSelect6}
                      onRemove={handleSelect6}
                      singleSelect
                      placeholder="To*"
                    />
                  </div>
                </div>
              )}
              {isClose3 === false && (
                <div className="col-md-3" style={{ paddingTop: "8px" }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="sun"
                      id="flexCheckDefault"
                      onChange={openFullHoursHandler}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Open 24 Hours
                    </label>
                  </div>
                </div>
              )}
              {fullOpen3 === false && (
                <div className="col-md-2" style={{ paddingTop: "8px" }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="sun"
                      id="flexCheckDefault"
                      onChange={closeHandler}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Closed
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex w-50 justify-content-between align-items-center">
              <h4>Plans</h4>
              <IoIosAddCircle
                onClick={createPlans}
                className="icon"
                style={{ cursor: "pointer" }}
              />
            </div>
            {plans.map((row, id) => (
              <div className="row" key={row.id}>
                <div className="col-md-3">
                  <div
                    style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                  >
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="category"
                      value={row.category}
                      onChange={(e) => onChangePlanHandler(e, row.id)}
                      required
                    >
                      <option>Select Category*</option>
                      {categories?.map((category) => (
                        <option
                          id={category._id}
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                  >
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => onChangePlanHandler2(e, row.id)}
                      value={row.duration}
                    >
                      <option>Duration</option>
                      <option value="Month">Month</option>
                      <option value="Day">Day</option>
                      <option value="Year">Year</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    onChange={(e) => handleInputPlanChange(e, row.id)}
                    name="price"
                    value={row.price}
                    className="property-input"
                    placeholder="Price*"
                    required
                  />
                </div>
                <div className="col-md-3 d-flex align-items-center">
                  <AiFillDelete
                    className="icon"
                    style={{ cursor: "pointer" }}
                    onClick={() => removePlan(row.id)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="form-footer">
            <button type="submit" className="saveproperty-btn">
              Save
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWorkSpace;
