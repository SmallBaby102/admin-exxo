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

const SocialAccountDetail = ({ match, history }) => {
  const [accountDetail, setAccountDetail] = useState();
  const [clientAccounts, setClientAccounts] = useState();
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [addNoteText, setAddNoteText] = useState("");

  useEffect(() => {
    const id = match.params.id;
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/user/social-account-info`, { params: { id: id }})
    .then(res => {
      console.log("social account detail: ", res.data.socialAccountInfo);
      let accountUuid = res.data.accountUuid;
      setAccountDetail(res.data.socialAccountInfo);

    });
  }, []);

  const changeTradingAccount = (e) => {

  }

  const onApproveClick = () => {
    if ( ibParentTradingAccountUuid === "" ) {
      toast.warn("Please select parent trading account!");
      return;
    }
    const id = match.params.id;
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/update-ib-status`, { id, sStatus: "Approved", ibParentTradingAccountUuid: ibParentTradingAccountUuid, decline_reason: ""})
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

    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/social-account-info`, { id, sStatus: "Declined", decline_reason: addNoteText })
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

  console.log("account detail information -------",accountDetail);

  return (
    <React.Fragment>
      <Head title="IB Client Details - Admin"></Head>
        <Content>
          <BlockHead size="sm">
            <BlockBetween className="g-3">
              <BlockHeadContent>
                <BlockTitle page>
                  Social Trading Account Infomation
                </BlockTitle>
              </BlockHeadContent>
              <BlockHeadContent>
                <Link to={`${process.env.PUBLIC_URL}/social-become`}>
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
                    <p>Soical Trading Account Info, email, Account Uuid, etc...</p>
                  </BlockHeadContent>
                </BlockHead>
                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Has Web Site?:</div>
                        <div className="data-value">{accountDetail?.hasWebsite? "Yes" :"No"}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Will Share Trading Performance on other social Trading Platform?</div>
                        <div className="data-value"> { accountDetail?.shareTradingPerformance? "Yes" :"No" }</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">How to Promote Services?</div>
                        <div className="data-value">{accountDetail?.promoteContent}</div>
                      </div>
                    </li>
                    
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Has client Base?:</div>
                        <div className="data-value">{accountDetail?.hasClientBase? "Yes" :"No"}</div>
                      </div>
                    </li>
                   
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Trading Instrument to be interesting:</div>
                        <div className="data-value">{accountDetail?.tradingInstrument}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Social Trading Account: </div>
                        <div className="data-value text-soft">{accountDetail?.tradingAccountId}</div>
                      </div>
                    </li>
                    
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Incentive Fee Percentage</div>
                        <div className="data-value">{accountDetail?.incentiveFeePercentage}</div>
                      </div> 
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label"> Status</div>
                        <div className="data-value"><strong>{accountDetail?.sStatus}</strong></div>
                      </div>
                    </li>
                    { accountDetail?.sStatus === "Declined" && 
                    <li className="data-item">
                      <div className="data-col">
                        <div className="sdata-label">Decline Reason</div>
                        <div className="data-value"><i>{accountDetail?.IBDeclineReason}</i></div>
                      </div> 
                    </li>
                    }
                    
                    { accountDetail && accountDetail.sStatus === "Pending"  && ( 
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
export default SocialAccountDetail;
