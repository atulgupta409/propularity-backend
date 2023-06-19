import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
import { Link, useNavigate } from "react-router-dom";
import "./Seo.css";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Delete from "../delete/Delete";
import { AiFillEdit } from "react-icons/ai";
import { config } from "../../services/Services";
import { getSeoData } from "./SeoService";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";

function Seo() {
  const [loading, setLoading] = useState(false);
  const [seos, setSeos] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [searchedSeos, setSearchedSeos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const toast = useToast();

  const handleFetchSeo = async () => {
    await getSeoData(setLoading, setSeos);
  };
  useEffect(() => {
    handleFetchSeo();
  }, [updateTable]);

  const handleDeleteSeo = async (id) => {
    try {
      const { data } = await axios.delete(`/api/seo/delete/${id}`, config);
      setUpdateTable((prev) => !prev);
      toast({
        title: "Deleted Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSearch = () => {
    const filteredSeos = seos.filter((seo) => {
      const matchName =
        seo.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(seo.path.toLowerCase());

      return matchName;
    });

    setSearchedSeos(filteredSeos);
    setCurPage(1);
  };

  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);

  const [selectItemNum, setSelectItemNum] = useState(5);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(searchedSeos?.length / selectItemNum);
  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }

  var nextPage = () => {
    const lastPage = Math.ceil(seos.length / selectItemNum);
    if (curPage < lastPage) {
      setCurPage((prev) => prev + 1);
    }
  };

  const getFirstPage = () => {
    setCurPage(1);
  };

  const getLastPage = () => {
    setCurPage(nPage);
  };
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <Link to="/seo/add-seo" className="btnLink">
        <Addpropertybtn />
      </Link>
      <div className="table-box">
        <div className="table-top-box">SEO Table</div>
        <TableContainer marginTop="60px" variant="striped" color="teal">
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Path"
              />
            </div>
          </div>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Path</Th>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td align="center" style={{ width: "50px" }}>
                    <Spinner
                      size="xl"
                      w={20}
                      h={20}
                      alignSelf="center"
                      style={{ position: "absolute", left: "482px" }}
                    />
                  </Td>
                </Tr>
              ) : showAll ? (
                seos
                  .slice((curPage - 1) * selectItemNum, curPage * selectItemNum)
                  .map((seo) => (
                    <Tr key={seo._id} id={seo._id}>
                      <Td>{seo.path}</Td>
                      <Td>{seo.title}</Td>
                      <Td className="tableDescription">
                        {seo.description.length > 200
                          ? seo.description.substring(0, 200) + "..."
                          : seo.description}
                      </Td>
                      <Td>
                        <Link to={`/seo/editseo/${seo._id}`}>
                          <AiFillEdit
                            style={{ fontSize: "22px", cursor: "pointer" }}
                          />
                        </Link>
                      </Td>
                      <Td>
                        <Delete
                          handleFunction={() => handleDeleteSeo(seo._id)}
                        />
                      </Td>
                    </Tr>
                  ))
              ) : searchedSeos.length > 0 ? (
                searchedSeos
                  .slice((curPage - 1) * selectItemNum, curPage * selectItemNum)
                  .map((seo) => (
                    <Tr key={seo._id} id={seo._id}>
                      <Td>{seo.path}</Td>
                      <Td>{seo.title}</Td>
                      <Td className="tableDescription">
                        {seo.description.length > 200
                          ? seo.description.substring(0, 200) + "..."
                          : seo.description}
                      </Td>
                      <Td>
                        <Link to={`/seo/editseo/${seo._id}`}>
                          <AiFillEdit
                            style={{ fontSize: "22px", cursor: "pointer" }}
                          />
                        </Link>
                      </Td>
                      <Td>
                        <Delete
                          handleFunction={() => handleDeleteSeo(seo._id)}
                        />
                      </Td>
                    </Tr>
                  ))
              ) : (
                <Tr>
                  <Td colSpan={8}>No matching results found.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <nav className="mt-5">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ width: "51%" }}
          >
            <p className="mb-0">Items per page: </p>
            <div style={{ borderBottom: "1px solid gray" }}>
              <select
                className="form-select"
                aria-label="Default select example"
                value={selectItemNum}
                onChange={itemsPerPageHandler}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div style={{ width: "110px" }}>
              {firstIndex + 1} - {searchedSeos?.length + firstIndex} of{" "}
              {seos?.length}
            </div>

            <div className="page-item">
              <BiSkipPrevious onClick={getFirstPage} />
            </div>
            <div className="page-item">
              <GrFormPrevious onClick={prePage} />
            </div>
            <div className="page-item">
              <GrFormNext onClick={nextPage} />
            </div>
            <div className="page-item">
              <BiSkipNext onClick={getLastPage} />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Seo;
