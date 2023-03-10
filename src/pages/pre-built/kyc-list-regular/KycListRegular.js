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
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../../actions";

const KycListRegular = ({ history }) => {
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [tablesm, updateTableSm] = useState(false);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [detail, setDetail] = useState({});
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [sortKind, setSortKind] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const dispatch = useDispatch();

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.fullname.localeCompare(b.fullname));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.fullname.localeCompare(a.fullname));
      setData([...sortedData]);
    }
  };
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/user/users`)
    .then(res => {
      console.log("data", res.data)
      setData(res.data);
      dispatch(setUsers(res.data));
      setOriginalData(res.data);
    })

  }, [])

  useEffect(() => {
    let defaultData = data;
    if (sortOrder === "asc") {
      let sortedData = [];
      if ( sortKind === "email" ) {
        sortedData = defaultData.sort((a, b) => a.email.localeCompare(b.email));
      } else if ( sortKind === "docType" ) {
        sortedData = defaultData.sort((a, b) => a.docType.localeCompare(b.docType));
      } else if ( sortKind === "submittedAt" ) {
        sortedData = defaultData.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
      } else if ( sortKind === "verification_status" ) {
        sortedData = defaultData.sort((a, b) => a.verification_status.localeCompare(b.verification_status));
      }       
      setData([...sortedData]);
    } else if (sortOrder === "desc") {
      let sortedData = [];
      if ( sortKind === "email" ) {
        sortedData = defaultData.sort((a, b) => b.email.localeCompare(a.email));
      } else if ( sortKind === "docType" ) {
        sortedData = defaultData.sort((a, b) => b.docType.localeCompare(a.docType));
      } else if ( sortKind === "submittedAt" ) {
        sortedData = defaultData.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
      } else if ( sortKind === "verification_status" ) {
        sortedData = defaultData.sort((a, b) => b.verification_status.localeCompare(a.verification_status));
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
    console.log("onSearchText", onSearchText)
    if (onSearchText !== "") {
      const filteredObject = kycData.filter((item) => {
        console.log("item", item)
        return item.fullname?.toLowerCase().includes(onSearchText.toLowerCase()) ||
        item.email?.toLowerCase().includes(onSearchText.toLowerCase()) || 
        item.docType?.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...kycData]);
    }
  }, [onSearchText]);

  // onChange function for searching name
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
        if (item.check === true) item.verification_status = "Rejected";
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
    newData[index].verification_status = "Approved";
    console.log(newData);
    setData([...newData]);
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/status/${id}`, { verification_status: "Approved"})
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
    newData[index].verification_status = "Rejected";
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/status/${id}`, { verification_status: "Rejected"})
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
      <Head title="KYC Lists - Admin"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>KYC Documents</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} KYC documents.</p>
              </BlockDes>
            </BlockHeadContent>
            {/* <BlockHeadContent>
              <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                <Icon name="download-cloud"></Icon>
                <span>Export</span>
              </Button>
              <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                <Icon name="download-cloud"></Icon>
              </Button>
            </BlockHeadContent> */}
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
                      placeholder="Search by user or email"
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
                <div className="nk-tb-col" onClick={(e) => { onSortHeaderClick(e, "email"); }}>
                  <span>User</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "docType"); }}>
                  <span>Doc Type</span>
                </div>
                <div className="nk-tb-col tb-col-mb">
                  <span>Documents</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "submittedAt"); }}>
                  <span>Submitted</span>
                </div>
                <div className="nk-tb-col tb-col-mb" onClick={(e) => { onSortHeaderClick(e, "verification_status"); }}>
                  <span>Status</span>
                </div>
                <div className="nk-tb-col tb-col-mb">
                  &nbsp;
                </div>
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
                          <Link to={`${process.env.PUBLIC_URL}/kyc-details-regular/${item._id}`}>
                            <div className="user-card">
                              <UserAvatar
                                theme={"primary"}
                                text={findUpper(item.fullname)}
                                image={item.image}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">
                                  {item.fullname}{" "}
                                  <span
                                    className={`dot dot-${
                                      item.verification_status === "Approved"
                                        ? "success"
                                        : item.verification_status === "Pending"
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
                          <span className="tb-lead-sub">{item.docType?.toUpperCase()}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <ul className="list-inline list-download">
                            {item.docUrl1 && (
                              <li>
                                Front Side{" "}
                                <a
                                  // href={`${process.env.REACT_APP_API_SERVER}/` + item.docUrl1.replace("public/", "") }
                                  href={`${process.env.REACT_APP_API_SERVER}/download` + item.docUrl1.replace("public", "") }
                                  className="popup"
                                >
                                  <Icon name="download"></Icon>
                                </a>
                              </li>
                            )}
                            {item.docUrl2 && (
                              <li>
                                Back Side{" "}
                                <a
                                  href={`${process.env.REACT_APP_API_SERVER}/download` + item.docUrl2.replace("public", "") }
                                  className="popup"
                                >
                                  <Icon name="download"></Icon>
                                </a>
                              </li>
                            )}
                            {item.docUrl3 && (
                              <li>
                                Other{" "}
                                <a
                                  href={`${process.env.REACT_APP_API_SERVER}/download` + item.docUrl3.replace("public", "") }
                                  className="popup"
                                >
                                  <Icon name="download"></Icon>
                                </a>
                              </li>
                            )}
                          </ul>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span className="tb-date">{ new Date(item.submittedAt).toLocaleString() }</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span
                            className={`tb-status text-${
                              item.verification_status === "Approved" ? "success" : item.verification_status === "Pending" ? "info" : "danger"
                            }`}
                          >
                            {item.verification_status}
                          </span>
                          {/* {item.verification_status !== "Pending" && (
                            <TooltipComponent
                              icon="info"
                              direction="top"
                              id={item._id + "pendingless"}
                              text={`${item.verification_status} at Dec 18, 2019 01:02 am`}
                            ></TooltipComponent>
                          )}
                          {!item.verification_status === "Pending" && (
                            <span>
                              <TooltipComponent icon="info" direction="top" text={item.date} id={item._id} />
                            </span>
                          )} */}
                        </DataTableRow>
                        {/* <DataTableRow size="lg">
                          <div className="user-card">
                            <UserAvatar theme="orange-dim" size="xs" text={(item.checked)}></UserAvatar>
                            <div className="user-name">
                              <span className="tb-lead">{item.checked} </span>
                            </div>
                          </div>
                        </DataTableRow> */}
                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            {/* <li
                              className="nk-tb-action-hidden"
                              onClick={() => {
                                loadDetail(item._id);
                                setViewModal(true);
                              }}
                            >
                              <TooltipComponent
                                tag="a"
                                containerClassName="btn btn-trigger btn-icon"
                                id={"view" + item._id}
                                icon="eye-fill"
                                direction="top"
                                text="Quick View"
                              />
                            </li> */}
                            {/* {item.verification_status === "Rejected" ?  
                             <li className="nk-tb-action-hidden" onClick={() => onApproveClick(item._id)}>
                                <TooltipComponent
                                  tag="a"
                                  containerClassName="btn btn-trigger btn-icon"
                                  id={"approve" + item._id}
                                  icon="check-fill-c"
                                  direction="top"
                                  text="Approve"
                                />
                              </li>
                              : item.verification_status === "Approved" ? (
                              <li className="nk-tb-action-hidden" onClick={() => onRejectClick(item._id)}>
                                <TooltipComponent
                                  tag="a"
                                  containerClassName="btn btn-trigger btn-icon"
                                  id={"reject" + item._id}
                                  icon="cross-fill-c"
                                  direction="top"
                                  text="Reject"
                                />
                              </li>
                            ) : (
                              <React.Fragment>
                                <li className="nk-tb-action-hidden" onClick={() => onApproveClick(item._id)}>
                                  <TooltipComponent
                                    tag="a"
                                    containerClassName="btn btn-trigger btn-icon"
                                    id={"approve" + item._id}
                                    icon="check-fill-c"
                                    direction="top"
                                    text="Approve"
                                  />
                                </li>
                                <li className="nk-tb-action-hidden" onClick={() => onRejectClick(item._id)}>
                                  <TooltipComponent
                                    tag="a"
                                    containerClassName="btn btn-trigger btn-icon"
                                    id={"reject" + item._id}
                                    icon="cross-fill-c"
                                    direction="top"
                                    text="Reject"
                                  />
                                </li>
                              </React.Fragment>
                            )} */}
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    {/* <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#view"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          loadDetail(item._id);
                                          setViewModal(true);
                                        }}
                                      >
                                        <Icon name="eye"></Icon>
                                        <span>Quick View</span>
                                      </DropdownItem>
                                    </li> */}
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#details"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          history.push(`${process.env.PUBLIC_URL}/kyc-details-regular/${item._id}`);
                                        }}
                                      >
                                        <Icon name="focus"></Icon>
                                        <span>View Details</span>
                                      </DropdownItem>
                                    </li>
                                    {item.verification_status === "Rejected" ? <li onClick={() => onApproveClick(item._id)}>
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
                                        </li> : item.verification_status === "Approved" ? (
                                      <li onClick={() => onRejectClick(item._id)}>
                                        <DropdownItem
                                          tag="a"
                                          href="#reject"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                          }}
                                        >
                                          <Icon name="na"></Icon>
                                          <span>Reject User</span>
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
                                            <span>Reject User</span>
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

      <Modal isOpen={viewModal} toggle={() => setViewModal(false)} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a
            href="#cancel"
            onClick={(ev) => {
              ev.preventDefault();
              setViewModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="nk-modal-head">
            <h4 className="nk-modal-title title">
              KYC Details <small className="text-primary"> {detail._id}</small>
            </h4>
          </div>
          <div className="nk-tnx-details mt-sm-3">
            <Row className="gy-3">
              <Col lg={6}>
                <span className="sub-text"> ID</span>
                <span className="caption-text">{detail._id}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Applicant Name </span>
                <span className="caption-text text-break">{detail.fullname}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Document Type </span>
                <span className="caption-text">{detail?.docType?.toUpperCase()}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Status</span>
                <Badge
                  color={detail.verification_status === "Approved" ? "success" : detail.verification_status === "Pending" ? "info" : "danger"}
                  size="md"
                >
                  {detail.verification_status}
                </Badge>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Date</span>
                <span className="caption-text"> {new Date(detail.submittedAt).toLocaleString() }</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Checked By</span>
                <span className="caption-text"> {detail.checked}</span>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default KycListRegular;
