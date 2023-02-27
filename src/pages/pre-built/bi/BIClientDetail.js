import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Card, Modal, ModalBody } from "reactstrap";
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
  Col
} from "../../../components/Component";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BIClientDetail = ({ match, history }) => {

  const [clientDetail, setClientDetail] = useState();
  const [clientAccounts, setClientAccounts] = useState();
  const [ibParentTradingAccountUuid, setIbParentTradingAccountUuid] = useState("");
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [addNoteText, setAddNoteText] = useState("");

  useEffect(() => {
    const id = match.params.id;
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/user/ib-client-detail`, { params: { id: id }})
    .then(res => {
      console.log("IB client detail: ", res.data);
      let accountUuid = res.data.accountUuid;
      setClientDetail(res.data);
      
      axios.get(`${process.env.REACT_APP_API_SERVER}/api/other/client_wallets`, { params: { isDemo: false, accountUuid: accountUuid }})
      .then(res => {
        console.log("IB client trading accounts: ", res.data);
        setClientAccounts(res.data);
      });
      
    });
  }, []);

  const changeTradingAccount = (e) => {
    setIbParentTradingAccountUuid( e.target.value ); 
  }

  const onApproveClick = () => {
    if ( ibParentTradingAccountUuid === "" ) {
      toast.warn("Please select parent trading account!");
      return;
    }
    const id = match.params.id;
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/update-ib-status`, { id, ibStatus: "Approved", ibParentTradingAccountUuid: ibParentTradingAccountUuid, decline_reason: ""})
    .then(res => {
      history.push("/ib-become");
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    })
  };

  // function to change to reject property for an item
  const onRejectClick = () => {
    setAddNoteModal(true);
  };

  const onDeclineIBRequest = () => {
    const id = match.params.id;
    if ( addNoteText === "" ) {
      toast.warn("Enter decline reason please.");
      return;
    }

    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/update-ib-status`, { id, ibStatus: "Declined", decline_reason: addNoteText })
    .then(res => {
      history.push("/ib-become");
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    });
    setAddNoteModal(false);
    setAddNoteText("");
  }

  return (
    <React.Fragment>
      <Head title="IB Client Details - Admin"></Head>
        <Content>
          <BlockHead size="sm">
            <BlockBetween className="g-3">
              <BlockHeadContent>
                <BlockTitle page>
                  IB Request Client Infomation
                </BlockTitle>
              </BlockHeadContent>
              <BlockHeadContent>
                <Link to={`${process.env.PUBLIC_URL}/ib-become`}>
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
              <Col lg="12">
                <BlockHead>
                  <BlockHeadContent>
                    {/* <BlockTitle tag="h5">Applicant Information</BlockTitle> */}
                    <p>IB Request Clinet info, email, Account Uuid, phone, address, etc...</p>
                  </BlockHeadContent>
                </BlockHead>
                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Full Name</div>
                        <div className="data-value">{clientDetail?.fullname}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Client Email</div>
                        <div className="data-value">{clientDetail?.email}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Phone Number</div>
                        <div className="data-value">{clientDetail?.phone}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Address</div>
                        <div className="data-value text-soft">{clientDetail?.city + ", " + clientDetail?.state + ", " + clientDetail?.country}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">IB Status</div>
                        <div className="data-value"><strong>{clientDetail?.ibStatus}</strong></div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">IB Link</div>
                        <div className="data-value">{clientDetail?.IBLink}</div>
                      </div> 
                    </li>
                    { clientDetail?.ibStatus === "Declined" && 
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Decline Reason</div>
                        <div className="data-value"><i>{clientDetail?.IBDeclineReason}</i></div>
                      </div> 
                    </li>
                    }
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Created Datetime</div>
                        <div className="data-value">{clientDetail?.submittedAt}</div>
                      </div> 
                    </li>
                    { clientDetail?.ibStatus === "Approved" && 
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Parent Trading Account</div>
                        <div className="data-value">{clientDetail?.ibParentTradingAccountUuid}</div>
                      </div> 
                    </li>
                    }
                    { clientDetail?.ibStatus === "Pending" && 
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Parent Trading Account</div>
                        <div className="">
                          <select className="c_select" onChange={e => changeTradingAccount(e)}>
                            <option disabled selected>Select Trading Account</option>
                          { clientAccounts && clientAccounts.map((account) => {
                            return (
                                <option value={account.uuid}>{account.login}</option>
                              );
                            })
                          } 
                        </select>
                        </div>
                      </div> 
                    </li>
                    }
                    { clientDetail && clientDetail.ibStatus === "Pending"  && ( 
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
                    )}
                  </ul>
                </Card>
              </Col>
            </Row>
          </Block>
        </Content>
        <Modal
          isOpen={addNoteModal}
          toggle={() => setAddNoteModal(false)}
          className="modal-dialog-centered"
        >
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                setAddNoteModal(false);
                setAddNoteText("");
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add Deline Note</h5>
              <div className="mt-4 mb-4">
                <textarea
                  defaultValue={addNoteText}
                  className="form-control no-resize"
                  onChange={(e) => setAddNoteText(e.target.value)}
                />
              </div>
              <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                <li>
                  <Button color="primary" size="md" type="submit" onClick={onDeclineIBRequest}>
                    Decline Withdraw
                  </Button>
                </li>
                <li>
                  <Button onClick={() => setAddNoteModal(false)} className="link link-light">
                    Close
                  </Button>
                </li>
              </ul>
            </div>
          </ModalBody>
        </Modal>
    </React.Fragment>
  );
};
export default BIClientDetail;
