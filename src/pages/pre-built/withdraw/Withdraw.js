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
import { Link } from "react-router-dom";
import axios from 'axios';
const Withdraw = ({ history }) => {
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
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/other/withdraw`)
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
      } else if ( sortKind === "amount" ) {
        sortedData = defaultData.sort((a, b) => a.amount.localeCompare(b.amount));
      } else if ( sortKind === "address" ) {
        sortedData = defaultData.sort((a, b) => a.address.localeCompare(b.address));
      } else if ( sortKind === "currency" ) {
        sortedData = defaultData.sort((a, b) => a.currency.localeCompare(b.currency));
      } else if ( sortKind === "tradingAccountId" ) {
        sortedData = defaultData.sort((a, b) => a.tradingAccountId.localeCompare(b.tradingAccountId));
      } else if ( sortKind === "method" ) {
        sortedData = defaultData.sort((a, b) => a.method.localeCompare(b.method));
      } else if ( sortKind === "submittedAt" ) {
        sortedData = defaultData.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
      } else if ( sortKind === "status" ) {
        sortedData = defaultData.sort((a, b) => a.status.localeCompare(b.status));
      }       
      setData([...sortedData]);
    } else if (sortOrder === "desc") {
      let sortedData = [];
      if ( sortKind === "email" ) {
        sortedData = defaultData.sort((a, b) => b.email.localeCompare(a.email));
      } else if ( sortKind === "amount" ) {
        sortedData = defaultData.sort((a, b) => b.amount.localeCompare(a.amount));
      } else if ( sortKind === "address" ) {
        sortedData = defaultData.sort((a, b) => b.address.localeCompare(a.address));
      } else if ( sortKind === "currency" ) {
        sortedData = defaultData.sort((a, b) => b.currency.localeCompare(a.currency));
      } else if ( sortKind === "tradingAccountId" ) {
        sortedData = defaultData.sort((a, b) => b.tradingAccountId.localeCompare(a.tradingAccountId));
      } else if ( sortKind === "method" ) {
        sortedData = defaultData.sort((a, b) => b.method.localeCompare(a.method));
      } else if ( sortKind === "submittedAt" ) {
        sortedData = defaultData.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
      } else if ( sortKind === "status" ) {
        sortedData = defaultData.sort((a, b) => b.status.localeCompare(a.status));
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
        return item.tradingAccountId?.toLowerCase().includes(onSearchText.toLowerCase()) || 
                item.email?.toLowerCase().includes(onSearchText.toLowerCase()) || 
                item.address?.toLowerCase().includes(onSearchText.toLowerCase());
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

  // function to declare the state change
  const onActionText = (e) => {
    setActionText(e.value);
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

  // function to fire actions after dropdowm select
  const onActionClick = (e) => {
    if (actionText === "Reject") {
      let newData = data.map((item) => {
        if (item.check === true) item.status = "Rejected";
        return item;
      });
      setData([...newData]);
    } else if (actionText === "Delete") {
      let newData;
      newData = data.filter((item) => item.check !== true);
      setData([...newData]);
    }
  };

  // function to change to approve property for an item
  const onApproveClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].status = "Approved";
    console.log(newData);
    setData([...newData]);
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/other/withdraw`, { id, status: "Approved"})
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    })
  };

  // function to change to reject property for an item
  const onRejectClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].status = "Rejected";
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/other/withdraw`, { id, status: "Rejected" })
    .then(res => {
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
      <Head title="Withdraw Requests"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Withdraw Requests</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} Withdraw Requests.</p>
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
                {/* <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap">
                      <RSelect
                        options={bulkActionKycOptions}
                        className="w-130px"
                        placeholder="Bulk Action"
                        onChange={(e) => onActionText(e)}
                      />
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          color="light"
                          outline
                          disabled={actionText === "" ? true : false}
                          className="btn-dim"
                          onClick={() => onActionClick()}
                        >
                          Apply
                        </Button>
                      </span>
                      <span className="d-md-none">
                        <Button
                          color="light"
                          outline
                          disabled={actionText === "" ? true : false}
                          className="btn-dim btn-icon"
                          onClick={() => onActionClick()}
                        >
                          <Icon name="arrow-right"></Icon>
                        </Button>
                      </span>
                    </div>
                  </div>
                </div> */}
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
                            {/* <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <div className="dot dot-primary"></div>
                                  <Icon name="filter-alt"></Icon>
                                </DropdownToggle>
                                <DropdownMenu
                                  right
                                  className="filter-wg dropdown-menu-xl"
                                  style={{ overflow: "visible" }}
                                >
                                  <div className="dropdown-head">
                                    <span className="sub-title dropdown-title">Advanced Filter</span>
                                  </div>
                                  <div className="dropdown-body dropdown-body-rg">
                                    <Row className="gx-6 gy-3">
                                      <Col size="6">
                                        <FormGroup>
                                          <label className="overline-title overline-title-alt">Doc Type</label>
                                          <RSelect options={filterDoc} placeholder="Any Type" />
                                        </FormGroup>
                                      </Col>
                                      <Col size="6">
                                        <FormGroup>
                                          <label className="overline-title overline-title-alt">Status</label>
                                          <RSelect options={filterStatus} placeholder="Any Status" />
                                        </FormGroup>
                                      </Col>
                                      <Col size="12">
                                        <FormGroup>
                                          <Button type="button" color="secondary">
                                            Filter
                                          </Button>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="dropdown-foot between">
                                    <a
                                      className="clickable"
                                      href="#reset"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      Reset Filter
                                    </a>
                                    <a
                                      href="#save"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      Save Filter
                                    </a>
                                  </div>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li> */}
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
                      placeholder="Search by trading account, email address or wallet address"
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
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "tradingAccountId"); }}>
                  <span>Trading Account Id</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "address"); }}>
                  <span>Address</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "amount"); }}>
                  <span>Amount</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "currency"); }}>
                  <span>Currency</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "method"); }}>
                  <span>Withdraw Method</span>
                </div>
                <div className="nk-tb-col tb-col-lg" onClick={(e) => { onSortHeaderClick(e, "submittedAt"); }}>
                  <span>Submitted</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "status"); }}>
                  <span>Status</span>
                </div>
                {/* <DataTableRow size="lg">
                  <span>Checked by</span>
                </DataTableRow> */}
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
                          <Link to={`${process.env.PUBLIC_URL}/withdraw_detail/${item._id}`}>
                            <div className="user-card">
                              <UserAvatar
                                theme={"primary"}
                                text={findUpper(item.email)}
                                image={item.image}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">
                                  {item.email}{" "}
                                  <span
                                    className={`dot dot-${
                                      (item.status === "Approved" || item.status === "DONE" )
                                        ? "success"
                                        : item.status === "Pending"
                                        ? "info"
                                        : "danger"
                                    } d-md-none ml-1`}
                                  ></span>
                                </span>
                                <span>{item.email}</span>
                              </div>
                            </div>
                          </Link>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="tb-lead-sub">{ item.tradingAccountId }</span>
                        </DataTableRow>
                        <DataTableRow size="mb" >
                          <span className="tb-lead-sub" style={{ overflowWrap: "anywhere"}}>{item.address}</span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="tb-lead-sub">{item.amount}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                            <span className="tb-lead-sub">{item.currency}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                            <span className="tb-lead-sub">{item.method}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span className="tb-date">{ new Date(item.submittedAt).toLocaleString() }</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span
                            className={`tb-status text-${
                              (item.status === "Approved" || item.status === "DONE") ? "success" : item.status === "Pending" ? "info" : "danger"
                            }`}
                          >
                            {item.status}
                          </span>
                        </DataTableRow>
                        {
                          item.status !== "DONE" &&
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
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default Withdraw;
