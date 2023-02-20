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

const WithdrawDetail = ({ match, history }) => {

  const [withdrawDetail, setWithdrawDetail] = useState();
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [addNoteText, setAddNoteText] = useState("");

  useEffect(() => {
    const id = match.params.id;
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/other/withdraw_detail`, { params: { id: id }})
    .then(res => {
      setWithdrawDetail(res.data);
    })
  }, []);

  const onApproveClick = () => {
    const id = match.params.id;
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/other/withdraw`, { id, status: "Approved"})
    .then(res => {
      history.push("/withdraw");
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

  const declineWithdraw = () => {
    const id = match.params.id;
    if ( addNoteText === "" ) {
      alert("Enter deline reason please.");
      return;
    }

    axios.post(`${process.env.REACT_APP_API_SERVER}/api/other/withdraw`, { id, status: "Rejected", decline_reason: addNoteText })
    .then(res => {
      history.push("/withdraw");
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
      <Head title="Withdraw Details - Admin"></Head>
        <Content>
          <BlockHead size="sm">
            <BlockBetween className="g-3">
              <BlockHeadContent>
                <BlockTitle page>
                  Withdraw Detail Infomation
                </BlockTitle>
              </BlockHeadContent>
              <BlockHeadContent>
                <Link to={`${process.env.PUBLIC_URL}/withdraw`}>
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
                    <p>Withdraw info, email, withdraw amount, status, currency etc.</p>
                  </BlockHeadContent>
                </BlockHead>
                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Client Email</div>
                        <div className="data-value">{withdrawDetail?.email}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Withdraw Amount</div>
                        <div className="data-value">{withdrawDetail?.amount + " " + withdrawDetail?.currency}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Trading Account ID</div>
                        <div className="data-value">{withdrawDetail?.tradingAccountId}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Status</div>
                        <div className="data-value text-soft">{withdrawDetail?.status}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">{withdrawDetail?.method === "USDT BEP20"?"Wallet Address":"Bank Infomation"}</div>
                        <div className="data-value">{withdrawDetail?.address}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Request Datetime</div>
                        <div className="data-value">{withdrawDetail?.submittedAt}</div>
                      </div>
                    </li>
                    { withdrawDetail && ( withdrawDetail.status === "Pending" || withdrawDetail.status === "Rejected") && ( 
                    <li className="data-item">
                      <div className="">
                        <Button type="button" color="primary" onClick={e => onApproveClick()}>
                          Approve
                        </Button>
                        { withdrawDetail.status === "Pending" && ( 
                        <Button type="button" color="light" onClick={e => onRejectClick() } className="ml-5" outline>
                          Decline
                        </Button>
                        )}
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
                  <Button color="primary" size="md" type="submit" onClick={declineWithdraw}>
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
export default WithdrawDetail;
