import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Badge, Card } from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  UserAvatar,
} from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";
import { Link } from "react-router-dom";
import { setChecking, setUsers } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const KycDetailsRegular = ({ match, history }) => {
  const [user, setUser] = useState();
  const [remark, setRemark] = useState("");
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  useEffect(() => {
    const id = match.params.id;
    if (id !== undefined || null || "") {
      let spUser = users.find((item) => item._id === id);
      setUser(spUser);
      setRemark(spUser?.remark);
    } else {
      // setUser(users[0]);
    }
    if(users.length < 1) {
      axios.get(`${process.env.REACT_APP_API_SERVER}/api/user/users`)
      .then(res => {
        dispatch(setUsers(res.data));
      })
    }
  }, [match.params.id, users]);
  const onApproveClick = () => {
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/status/${user._id}`, { verification_status: "Approved", remark })
    .then(res => {
      console.log(res);
      history.push("/kyc-list-regular");
    })
    .catch(e => {
      console.log(e);
    })
  };

  // function to change to reject property for an item
  const onRejectClick = () => {
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/status/${user._id}`, { verification_status: "Rejected", remark })
    .then(res => {
      history.push("/kyc-list-regular");
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    })
  };
  return (
    <React.Fragment>
      <Head title="KYC Details - Admin"></Head>
      {user && (
        <Content>
          <BlockHead size="sm">
            <BlockBetween className="g-3">
              <BlockHeadContent>
                <BlockTitle page>
                  KYCs / <strong className="text-primary small">{user.fullname}</strong>
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      Application ID: <span className="text-base">{user._id}</span>
                    </li>
                    <li>
                      Submitted At: <span className="text-base">{ new Date(user.submittedAt).toLocaleString()}</span>
                    </li>
                  </ul>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <Link to={`${process.env.PUBLIC_URL}/kyc-list-regular`}>
                  <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                    <Icon name="arrow-left"></Icon>
                    <span>Back</span>
                  </Button>
                  <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                    <Icon name="arrow-left"></Icon>
                  </Button>
                </Link>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>

          <Block>
            <Row className="gy-5">
              <Col lg="5">
                <BlockHead>
                  <BlockHeadContent>
                    <BlockTitle tag="h5">Application Info</BlockTitle>
                    <p>Submission date, approve date, status etc.</p>
                  </BlockHeadContent>
                </BlockHead>
                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Submitted By</div>
                        <div className="data-value">{user.id}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Submitted At</div>
                        <div className="data-value">{new Date(user.submittedAt).toLocaleString()}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Status</div>
                        <div className="data-value">
                          <Badge
                            size="sm"
                            color={
                              user.verification_status === "Approved"
                                ? "outline-success"
                                : user.verification_status === "Pending"
                                ? "outline-info"
                                : "outline-danger"
                            }
                            className="badge-dim"
                          >
                            {user.verification_status}
                          </Badge>
                        </div>
                      </div>
                    </li>
                  </ul>
                </Card>
                <BlockHead>
                  <BlockHeadContent>
                    <BlockTitle tag="h5">Uploaded Documents</BlockTitle>
                    <p>Here is user uploaded documents.</p>
                  </BlockHeadContent>
                </BlockHead>

                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Document Type</div>
                        <div className="data-value">{user.docType?.toUpperCase()}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Front Side</div>
                        <div className="data-value">
                          <a  href={`${process.env.REACT_APP_API_SERVER}/download` + user.docUrl1?.replace("public", "") }
                              className="popup"
                            >
                              <Icon name="download"></Icon>
                          </a>
                        </div>
                      </div>
                    </li>
                    {
                      user?.docType !== "passport" &&
                      <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Back Side</div>
                        <div className="data-value">
                          <a href={`${process.env.REACT_APP_API_SERVER}/` + user.docUrl2?.replace("public", "") }
                                className="popup"
                              >
                                <Icon name="download"></Icon>
                          </a>
                        </div>
                      </div>
                    </li>
                    }
                       <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Other</div>
                        <div className="data-value">
                          <a  href={`${process.env.REACT_APP_API_SERVER}/download` + user.docUrl3?.replace("public", "") }
                              className="popup"
                            >
                              <Icon name="download"></Icon>
                          </a>
                        </div>
                      </div>
                    </li>
                    
                  </ul>
                </Card>
              </Col>

              <Col lg="7">
                <BlockHead>
                  <BlockHeadContent>
                    <BlockTitle tag="h5">Applicant Information</BlockTitle>
                    <p>Basic info, like name, phone, address, country etc.</p>
                  </BlockHeadContent>
                </BlockHead>
                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">First Name</div>
                        <div className="data-value">{user.fullname.split(" ")[0]}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Last Name</div>
                        <div className="data-value">{user.fullname.split(" ").pop()}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Email Address</div>
                        <div className="data-value">{user.email}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Phone Number</div>
                        <div className="data-value text-soft">
                          {user.phone}
                        </div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Date of Birth</div>
                        <div className="data-value">{user.birthday}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Country of Residence</div>
                        <div className="data-value">{user.country}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">City</div>
                        <div className="data-value">{user.city}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Full Address</div>
                        <div className="data-value">{user.address}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Remark</div>
                        <textarea multiple cols="50" value={remark} onChange={e => setRemark(e.target.value)} placeholder="Please write the reason of decline."></textarea>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="">
                        <Button type="button" color="primary" onClick={e => onApproveClick()}>
                          Approve
                        </Button>
                        <Button type="button" color="light" onClick={e => onRejectClick() } className="ml-5" outline>
                          Decline
                        </Button>
                      </div>
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Block>
        </Content>
      )}
    </React.Fragment>
  );
};
export default KycDetailsRegular;
