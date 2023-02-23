import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Modal,
  ModalBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  DropdownItem,
  Badge,
} from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Col,
  Row,
  TooltipComponent,
  UserAvatar,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  RSelect,
} from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";
import axios from 'axios';
import { toast } from "react-toastify";
const BIClient = ({ history }) => {
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [tablesm, updateTableSm] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [detail, setDetail] = useState({});
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [sortKind, setSortKind] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/user/ib-clients`)
    .then(res => {
      console.log("data", res.data)
      setData(res.data);
      setOriginalData(res.data);
    });
  }, []);

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.tradingAccountId.localeCompare(b.tradingAccountId));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.tradingAccountId.localeCompare(a.tradingAccountId));
      setData([...sortedData]);
    }
  };  

  useEffect(() => {
    let defaultData = data;
    if (sortOrder === "asc") {
      let sortedData = [];
      if ( sortKind === "email" ) {
        sortedData = defaultData.sort((a, b) => a.email.localeCompare(b.email));
      } else if ( sortKind === "phone" ) {
        sortedData = defaultData.sort((a, b) => a.phone.localeCompare(b.phone));
      } else if ( sortKind === "accountUuid" ) {
        sortedData = defaultData.sort((a, b) => a.accountUuid.localeCompare(b.accountUuid));
      } else if ( sortKind === "ibStatus" ) {
        sortedData = defaultData.sort((a, b) => a.ibStatus.localeCompare(b.ibStatus));
      } else if ( sortKind === "parentTradingAccountUuid" ) {
        sortedData = defaultData.sort((a, b) => a.tradingAccountId.localeCompare(b.parentTradingAccountUuid));
      }     
      setData([...sortedData]);
    } else if (sortOrder === "desc") {
      let sortedData = [];
      if ( sortKind === "email" ) {
        sortedData = defaultData.sort((a, b) => b.email.localeCompare(a.email));
      } else if ( sortKind === "phone" ) {
        sortedData = defaultData.sort((a, b) => b.phone.localeCompare(a.phone));
      } else if ( sortKind === "accountUuid" ) {
        sortedData = defaultData.sort((a, b) => b.accountUuid.localeCompare(a.accountUuid));
      } else if ( sortKind === "ibStatus" ) {
        sortedData = defaultData.sort((a, b) => b.ibStatus.localeCompare(a.ibStatus));
      } else if ( sortKind === "parentTradingAccountUuid" ) {
        sortedData = defaultData.sort((a, b) => b.parentTradingAccountUuid.localeCompare(a.parentTradingAccountUuid));
      } 
      setData([...sortedData]);
    }
  }, [sortKind, sortOrder]);

  // sort param change function 
  const onSortHeaderClick = (e, kind) => {
    if ( kind === sortKind ) setSortOrder(sortOrder==="desc"?"asc":"desc");
    setSortKind(kind);        
  }

  // Changing state value when searching name
  useEffect(() => {
    let kycData = originalData;
    if (onSearchText !== "") {
      const filteredObject = kycData.filter((item) => {
        return item.parentTradingAccountUuid?.toLowerCase().includes(onSearchText.toLowerCase()) || 
                item.email?.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...kycData]);
    }
  }, [onSearchText]);

  // onChange function for searching key
  const onFilterChange = (e) => {
    setSearchText(e.target.value);    
  };

  // function to select all the items of the table
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function to change the property of an item of the table
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // function to change to approve property for an item
  const onApproveClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].ibStatus = "Approved";
    console.log(newData);
    setData([...newData]);
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/update-ib-status`, { id, ibStatus: "Approved"})
    .then(res => {
      console.log(res);
      toast.success("IB request approved successfully");
    })
    .catch(e => {
      console.log(e);
    })
  };

  // function to change to reject property for an item
  const onRejectClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].ibStatus = "Declined";
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/update-ib-status`, { id, ibStatus: "Declined" })
    .then(res => {
      toast.success("IB request declined successfully");
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    })
    setData([...newData]);
  };

  // function to load detail data
  const loadDetail = (id) => {
    let index = data.findIndex((item) => item._id === id);
    setDetail(data[index]);
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <Head title="IB Clients"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>IB Clients</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} IB Clients(Pending, Approved and Declined).</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                <Icon name="download-cloud"></Icon>
                <span>Export</span>
              </Button>
              <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                <Icon name="download-cloud"></Icon>
              </Button>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </Button>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right className="dropdown-menu-xs">
                                  <ul className="link-check">
                                    <li>
                                      <span>Show</span>
                                    </li>
                                    <li className={itemPerPage === 10 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(10);
                                        }}
                                      >
                                        10
                                      </DropdownItem>
                                    </li>
                                    <li className={itemPerPage === 15 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(15);
                                        }}
                                      >
                                        15
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                  <ul className="link-check">
                                    <li>
                                      <span>Order</span>
                                    </li>
                                    <li className={sort === "dsc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("dsc");
                                          sortFunc("dsc");
                                        }}
                                      >
                                        DESC
                                      </DropdownItem>
                                    </li>
                                    <li className={sort === "asc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("asc");
                                          sortFunc("asc");
                                        }}
                                      >
                                        ASC
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                      className="search-back btn-icon toggle-search"
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by email address or trading account uuid"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      id="uid_1"
                      onChange={(e) => selectorCheck(e)}
                    />
                    <label className="custom-control-label" htmlFor="uid_1"></label>
                  </div>
                </DataTableRow>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "email"); }}>
                  <span>User</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "phone"); }}>
                  <span>Phone</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "accountUuid"); }}>
                  <span>Account UUID</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "ibStatus"); }}>
                  <span>Status</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "parentTradingAccountUuid"); }}>
                  <span>Parent Trading Account UUID</span>
                </div>
                <DataTableRow className="nk-tb-col-tools">&nbsp;</DataTableRow>
              </DataTableHead>

              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item._id}>
                        <DataTableRow className="nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              defaultChecked={item.check}
                              id={item._id + "uid1"}
                              key={Math.random()}
                              onChange={(e) => onSelectChange(e, item._id)}
                            />
                            <label className="custom-control-label" htmlFor={item._id + "uid1"}></label>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="user-card">
                            <UserAvatar
                              theme={"primary"}
                              text={findUpper(item.email)}
                              image={item.image}
                            ></UserAvatar>
                            <div className="user-info">
                              <span className="tb-lead">{item.fullname}{" "}</span>
                              <span>{item.email}</span>
                            </div>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="tb-lead-sub">{ item.phone }</span>
                        </DataTableRow>
                        <DataTableRow size="mb" >
                          <span className="tb-lead-sub" style={{ overflowWrap: "anywhere"}}>{item.accountUuid}</span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="tb-lead-sub">{item.ibStatus}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                            <span className="tb-lead-sub">{item.parentTradingAccountUuid}</span>
                        </DataTableRow>
                        {
                          item.ibStatus !== "Approved" &&
                          <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    {item.status === "Rejected" ? <li onClick={() => onApproveClick(item._id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#approve"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="check-thick"></Icon>
                                            <span>Approve</span>
                                          </DropdownItem>
                                        </li> : item.status === "Approved" ? (
                                      <li onClick={() => onRejectClick(item._id)}>
                                        <DropdownItem
                                          tag="a"
                                          href="#reject"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                          }}
                                        >
                                          <Icon name="na"></Icon>
                                          <span>Reject</span>
                                        </DropdownItem>
                                      </li>
                                    ) : (
                                      <React.Fragment>
                                        <li onClick={() => onApproveClick(item._id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#approve"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="check-thick"></Icon>
                                            <span>Approve</span>
                                          </DropdownItem>
                                        </li>
                                        <li onClick={() => onRejectClick(item._id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#suspend"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="na"></Icon>
                                            <span>Reject</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                        }
                      
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  noDown
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">There are not IB Client.</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default BIClient;
