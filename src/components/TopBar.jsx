import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import {
  Brightness3,
  WbSunnyRounded,
  Language,
  AppsRounded,
  Menu,
} from "@material-ui/icons";
import { useStateValue } from "../StateProvider";
import "./styles/TopBar.css";
import Connectbutton from "./ConnectWallet";
import {TOKEN_DETAIL, ERC20_ABI} from "../config.js"
import LIOE from "../images/LIOE.png";

const TopBar = ({
  bar,
  setBar,
  showBar,
  setShowBar,
  paddingLeft,
  setPaddingLeft,
  paddingRight,
  setPaddingRight,
}) => {
  const [{ theme, chainInfo, walletAddr }, dispatch] = useStateValue();
  const [buyUrl, setBuyUrl] = useState('https://app.pangolin.exchange/#/swap?inputCurrency=0x6a2e100bb4e6b9a12386483ef717ff388151c0c8');
  const [lioeBal, setLioeBal] = useState(0)

  useEffect(() => {
    if (chainInfo && chainInfo.buyUrl) {
      setBuyUrl(chainInfo.buyUrl);
    }
  }, [chainInfo])

  useEffect(() => {
    if ((walletAddr !== "Connect" && walletAddr !== "") && (chainInfo && chainInfo.rpcUrls)) {
      let web3 = new Web3(chainInfo.rpcUrls[0])
      //let web3 = new Web3(window.ethereum)
      const tokenContract = new web3.eth.Contract(ERC20_ABI, TOKEN_DETAIL.address);
      tokenContract.methods.balanceOf(walletAddr).call(
      ).then((res) => {
        setLioeBal(Number(res) / Math.pow(10, TOKEN_DETAIL.decimals))
      })
    } else {
      setLioeBal(0)
    }
  }, [walletAddr, chainInfo])
  

  async function addTokenToMetamask() {
    if (window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: TOKEN_DETAIL
        },
      });
    }
  }

  return (
    <div className="topbar">
      <div className="topbar__icons">
        {/* {bar && ( */}
        <button
          className="topbar__icon dark:bg-shark-light-500"
          onClick={() => {
            setShowBar(!showBar);
            setPaddingLeft(!paddingLeft);
            setPaddingRight(!paddingRight);
          }}
        >
          <Menu />
        </button>
        {/* )} */}

        <button
          className="topbar__icon hid dark:bg-shark-light-500"
          onClick={() =>
            dispatch({
              type: "SWITCH_THEME",
            })
          }
        >
          {theme === "light" ? (
            <div className="moon">
              <Brightness3 />
            </div>
          ) : (
            <div className="sun">
              <WbSunnyRounded />
            </div>
          )}
        </button>

        {/* <button className="topbar__icon dark:bg-shark-light-500" onClick={() => {window.open("https://bridge.canopus.network/", '_blank')}}>
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="MuiSvgIcon-root"
            viewBox="0 0 64 64" style={{enableBackground:"new 0 0 64 64", fontSize: "1.8em"}}>
          <path className="st0" d="M57.1,26.9h-4.2c-0.7-2.1-2.1-3.9-4.1-5.1l-9.3-5.4c-2.8-1.6-6.2-1.6-9,0l-9.3,5.4c-2.8,1.6-4.5,4.6-4.5,7.8
            v7.7h-3.8c-1.6,0-2.9,1.3-2.9,2.9s1.3,2.9,2.9,2.9h4.2c0.7,2.1,2.1,3.9,4.1,5.1l9.3,5.4c1.4,0.8,3,1.2,4.5,1.2
            c1.6,0,3.1-0.4,4.5-1.2l9.3-5.4c2.8-1.6,4.5-4.6,4.5-7.8v-7.7h3.8c1.6,0,2.9-1.3,2.9-2.9S58.7,26.9,57.1,26.9z M22.4,29.6
            c0-1.2,0.6-2.3,1.6-2.8l9.3-5.4c0.5-0.3,1.1-0.4,1.6-0.4c0.6,0,1.1,0.1,1.6,0.4l9.3,5.4c0,0,0.1,0.1,0.1,0.1h-3.7
            c-3.7,0-7.1,2-8.9,5.1l-1.8,3.1c-0.8,1.4-2.3,2.3-4,2.3h-5.2V29.6z M47.6,40.4c0,1.2-0.6,2.3-1.6,2.8l-9.3,5.4c-1,0.6-2.3,0.6-3.3,0
            l-9.3-5.4c0,0-0.1-0.1-0.1-0.1h3.7c3.7,0,7.1-2,8.9-5.1l1.8-3.1c0.8-1.4,2.3-2.3,4-2.3h5.2V40.4z" style={{fill:"#F7C735"}}/>
          </svg>
        </button> */}

        <button className="topbar__icon dark:bg-shark-light-500">
          <Language onClick={() => {window.open("https://ancient.cash", '_blank')}}/>
        </button>
      </div>

      <div className="topbar__action">
        <button className="topbar__icon hid dark:bg-shark-light-500" onClick={addTokenToMetamask}>
          <img
            src={LIOE}
            alt="Icon"
            className="MuiSvgIcon-root"
          />
        </button>

        <button className="topbar__btn hid" style={{ marginRight: "10px" }} onClick={() => {window.open(buyUrl, '_blank')}}>
          Buy LioE
        </button>

        <div className="topbar__info dark:bg-shark-light-500 dark:text-white">
          <p>{lioeBal} LioE</p>
          {/*<button className="topbar__btn">Connect</button>*/}
          {<Connectbutton/>}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
