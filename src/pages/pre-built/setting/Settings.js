import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  BackTo,
  PreviewCard,
  CodeBlock,
  Button,

} from "../../../components/Component";
import { Input, Row, Col, Spinner } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const admin = useSelector(state => state.user.admin);
  const [adminWallet, setAdminWallet] = useState({
    address: null,
    privateKey: null,
  });
  const [sysSetting, setSysSetting] = useState({
    telegram: null
  });

  const [setting, setSetting] = useState({
    usdtPrice: 1,
    usdtPrice: 1,
    // payment
    usdt: false,
    bank: false,
    npay: false,
    neteller: false,
    skrill: false,
    sticpay: false,
  });
  const save = e => {
    if (loading) {
      return;
    }
    let regex = /^0x[a-fA-F0-9]{40}$/;
    if (adminWallet?.address.match(regex) === null) {
      toast.warn("Invalid BSC address entered!");
      return;
    }
    regex = /^[a-fA-F0-9]{64}$/;
    if (adminWallet?.privateKey.match(regex) === null) {
      toast.warn("Invalid BSC private key entered!");
      return;
    }
    setLoading(true);
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/other/setting`, { setting, adminWallet, sysSetting })
    .then(res => {
        toast.success("Successfully updated!");
      setLoading(false);
    })
    .catch(err => {
      toast.success("Update failed!");
      setLoading(false);
    })
  
  } 

  const onChangeSysSettingTelegram = e => {
    setSysSetting({ ...setting, telegram: e.target.value});
  }

  const onChangeRate = e => {
    setSetting({ ...setting, usdtPrice: e.target.value});
  }

  const onChangeAdminWalletAddress = e => {
    setAdminWallet({ ...adminWallet, address: e.target.value});
  }

  const onChangeAdminWalletPrivateKey = e => {
    setAdminWallet({ ...adminWallet, privateKey: e.target.value});
  }

  useEffect(() => {
    if(admin?.role !== "Super Admin") {
      history.push("/kyc-list-regular");
      return;
    }
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/other/setting`)
    .then(res => {
      let payments = {};
      for (let index = 0; index < res.data.paymentMethods.length; index++) {
        const element = res.data.paymentMethods[index];
        payments = { ...payments, [element["name"]]: element["status"]}
      } 
      console.log(payments)
      let usdtItem = res.data?.cryptoRates?.find(item => item.pair === "usdtPrice");
      setSetting({ usdtPrice: usdtItem.rate, ...payments });
      setAdminWallet({ address: res.data?.adminWallet?.address, privateKey: res.data?.adminWallet?.privateKey });
      setSysSetting({telegram: res.data.sysSetting.telegram});
    })
    .catch(err => {

    })
  }, [])
  return (
    <React.Fragment>
      <Head title="Setting" />
      <Content page="component">
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Payment Methods</BlockTitle>
              <p>
                The checked payment methods are displayed in Client Portal.
              </p>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <Row className="gy-4">
              <Col sm="6" md="3">
                <div className="preview-block">
                  <span className="preview-title overline-title">USDT BEP20</span>
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" 
                    checked={setting.usdt}
                    className="custom-control-input form-control" id="usdt_payment" onChange={e => setSetting({...setting, usdt: e.target.checked })} />
                    <label className="custom-control-label" htmlFor="usdt_payment">
                      USDT BEP20 
                    </label>
                  </div>
                </div>
              </Col>
              <Col sm="6" md="3">
                <span className="preview-title overline-title">BANK</span>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input form-control"
                    checked={setting.bank}
                    onChange={e => setSetting({...setting, bank: e.target.checked })}
                    id="bank_payment"
                  />
                  <label className="custom-control-label" htmlFor="bank_payment">
                  Vietnam Internet Banking Transfer
                  </label>
                </div>
              </Col>
              <Col sm="6" md="3">
                <div className="preview-block">
                  <span className="preview-title overline-title">9Pay</span>
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" 
                    checked={setting.npay}
                    onChange={e => setSetting({...setting, npay: e.target.checked })}
                    className="custom-control-input form-control" id="9pay_payment" />
                    <label className="custom-control-label" htmlFor="9pay_payment">
                    9Pay Viet Nam
                    </label>
                  </div>
                </div>
              </Col>
              <Col sm="6" md="3">
                <div className="preview-block">
                  <span className="preview-title overline-title">Neteller</span>
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" 
                    checked={setting.neteller}

                    onChange={e => setSetting({...setting, neteller: e.target.checked })}
                    className="custom-control-input form-control" id="neteller_payment" />
                    <label className="custom-control-label" htmlFor="neteller_payment">
                    Neteller
                    </label>
                  </div>
                </div>
              </Col>
              <Col sm="6" md="3">
                <div className="preview-block">
                  <span className="preview-title overline-title">Skrill</span>
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" 
                    checked={setting.skrill}
                    onChange={e => setSetting({...setting, skrill: e.target.checked })}
                    className="custom-control-input form-control" id="skrill_payment" />
                    <label className="custom-control-label" htmlFor="skrill_payment">
                    Skrill
                    </label>
                  </div>
                </div>
              </Col>
              <Col sm="6" md="3">
                <div className="preview-block">
                  <span className="preview-title overline-title">Sticpay</span>
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" 
                    checked={setting.sticpay}
                    onChange={e => setSetting({...setting, sticpay: e.target.checked })}
                    className="custom-control-input form-control" id="sticpay_payment" />
                    <label className="custom-control-label" htmlFor="sticpay_payment">
                    Sticpay
                    </label>
                  </div>
                </div>
              </Col>
            </Row>
          </PreviewCard>
        </Block>
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Exchange Rate</BlockTitle>
              <p>
                The clients will deposit at this rate.
              </p>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <Row className="gy-4">
              <div className="input-group">
                <div className="p-1 col-md-3" >
                  USDT/USD
                </div>
                <input type="number" className="form-control" value={setting.usdtPrice} onChange={e => onChangeRate(e)} />
                <div className="input-group-append">
                    <span className="input-group-text">$</span>
                </div>
            </div>
            </Row>
            <Row className="gy-4">
              <div className="input-group">
                <div className="p-1 col-md-3" >
                  Admin Wallet Address
                </div>
                <input type="text" className="form-control" value={adminWallet.address} onChange={e => onChangeAdminWalletAddress(e)} />
            </div>
            </Row>
            <Row className="gy-4">
              <div className="input-group">
                <div className="p-1 col-md-3" >
                  Admin Wallet PrivateKey
                </div>
                <div className="input-group-append">
                    <span className="input-group-text">0x</span>
                </div>
                <input type="text" className="form-control" value={adminWallet.privateKey} onChange={e => onChangeAdminWalletPrivateKey(e)} />
            </div>
            </Row>
          </PreviewCard>
        </Block>
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Setting</BlockTitle>
              <p>
                You can set system configiration.
              </p>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <Row className="gy-4">
              <div className="input-group">
                <div className="p-1 col-md-3" >
                  Telegram Link
                </div>
                <input type="text" className="form-control" value={sysSetting.telegram} onChange={e => onChangeSysSettingTelegram(e)} />
            </div>
            </Row>
          </PreviewCard>
        </Block>
        <Block size="lg">
          <PreviewCard>
            <Row className="gy-4">
                  <Button type="button"  color="primary" size="lg" className="btn-block" onClick={e => save(e)}>
                    {loading ? <Spinner size="sm" color="light" /> : "Save"}
                  </Button>
            </Row>
          </PreviewCard>
        </Block>

      </Content>
    </React.Fragment>
  );
};

export default Settings;
