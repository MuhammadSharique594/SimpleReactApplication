import { React, useState, useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import {TableRow} from "@mui/material";
import { ApiContext } from "../../../Context/ApiContext";
import { Trash, Add, TableDocument, Calendar } from "iconsax-react";
import { Button, Col, Spinner  } from "react-bootstrap";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "black",
    color: "white",
  },
}));

const RequestApplicationList = ({ sidebarLinks, onChangeToggle }) => {

  const columns = [
    { id: "subjectText", label: "Application Lists", minWidth: 170 },
    { id: "createdDate", label: "Created Date", minWidth: 170 },
    { id: "delete", label: "", minWidth: 20 },
  ];

  const { SetApplicationId, allApplicationsData, GetAllApplication, DeleteApplication } = useContext(ApiContext);
  const [allData, setAllData] = useState(allApplicationsData);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(parseInt(localStorage.getItem("rowsPerPage")) || 10);
  const [linksState, setLinks] = useState({
    links: [...sidebarLinks],
  });

  useEffect(() => {
    GetAllApplication().then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setAllData(allApplicationsData);
  }, [isLoading]);

  useEffect(() => {
    // Store the selected page size in localStorage whenever it changes
    localStorage.setItem("rowsPerPage", rowsPerPage);
  }, [rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const get = (text) => {
    if (text == undefined) {
      return "";
    }

    return text.length > 50 ? text.substr(0, 40) + "..." : text;
  };

  const openApplication = (applicationId) => {
    SetApplicationId(applicationId);

    linksState.links.forEach((link) => (link.active = false));

    const link = linksState.links.find((link) => link.id === 4);
    if (!link.href) {
      link.active = true;

      setLinks((prev) => {
        return {
          links: [...prev.links],
        };
      });

      onChangeToggle(link.text.toLowerCase());
    }
  };

  const deleteRequestedApplication = async (applicationId) => {
    if(window.confirm("Are you sure you want to delete this application?"))
    {
      if(await DeleteApplication(applicationId))
      {
        setAllData(allData.filter((app) => app.applicationId != applicationId))
        alert('Successfully deleted!');
      }
      else{
        alert('Unexpected error!');
      }
    }
  }

  if(isLoading)
  {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  else{
    return (
      <>
        <h4 Style="float: left; margin-top:10px;">Application Requests</h4>
        <Tooltip title="Add New Application">
          <Button
            variant="success"
            className="mt-1 py-1 px-4"
            type="button"
            style={{ marginBottom: "15px", float: "right" }}
            onClick={() => {
              openApplication("");
            }}
          >
            <span Style="margin-right: 5px;">
              <Add size="20" color="white" />
            </span>
            New
          </Button>
        </Tooltip>
  
        <br />
        <Paper sx={{ width: "100%", overflow: "hidden", border:"1px solid #E7E7E7", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead >
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, color: "#ffffff",  backgroundColor: "#2C426A"}}
                    >
                      { column.id === 'subjectText' ? <TableDocument size="20" color="white" /> : <></>}
                      { column.id === 'createdDate' ? <Calendar size="20" color="white" /> : <></>}
                      
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allData
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row, index) => {
                    return (
                      <StyledTableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.applicationId}
                        sx={{ cursor: "pointer"}}
                      >
                        <TableCell
                          align="left"
                          onClick={() => {
                            openApplication(row.applicationId);
                          }}
                          style={{ color: "#000000",  backgroundColor: index % 2 == 0 ? "#E5EEFF" : "#DBE8FF"}}
                        >
                          {row.subject}
                          <br />
                          <span Style="font-size: 10px;">{get(row.text)}</span>
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => {
                            openApplication(row.applicationId);
                          }}
                          style={{ color: "#000000",  backgroundColor: index % 2 == 0 ? "#E5EEFF" : "#DBE8FF"}}
                        >
                          {row.createdDate}
                        </TableCell>
                        <TableCell 
                          align="left" 
                          style={{ color: "#000000",  backgroundColor: index % 2 == 0 ? "#E5EEFF" : "#DBE8FF"}}>
                        <Tooltip title="Delete Application">
                          <Trash
                            size="20"
                            color="black"
                            onClick={async () => {
                              deleteRequestedApplication(row.applicationId)
                            }}
                          />
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={allData ? allData.length : 1}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{backgroundColor: '#F5F5F5'}}
          />
        </Paper>
      </>
    );
  }
};

export default RequestApplicationList;
