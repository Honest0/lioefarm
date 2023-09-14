import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import {
  HomeFilled,
  CreditCardFilled,
  ThunderboltFilled,
  QuestionCircleOutlined,
  TwitterOutlined,
  MediumOutlined,
  SendOutlined,
} from "@ant-design/icons";
import "./styles/Sidebar.css";
import LIOE from "../../src/images/LIOE.png"

const Sidebar = ({
  bar,
  setBar,
  showBar,
  setShowBar,
  paddingLeft,
  setPaddingLeft,
  paddingRight,
  setPaddingRight,
}) => {
  let isHome = useRouteMatch("/");

  const isStake = useRouteMatch("/stake");
  const isSupply = useRouteMatch("/supply");

  if (isStake || isSupply) isHome = false;

  return (
    // <div
    //   className={`sidebar dark:bg-shark-light-500${
    //     showBar && bar ? " sidebar-mobile--active" : ""
    //   }${bar ? " sidebar-mobile" : ""}`}
    // >
    <div
      className={`sidebar dark:bg-shark-light-500${
        showBar ? " sidebar-mobile--active" : ""
      }${" sidebar-mobile"}`}
    >
      <div
        className="close-btn dark:bg-shark-light-500 dark:text-white"
        onClick={() => {
          setShowBar(false);
          setPaddingLeft(!paddingLeft);
          setPaddingRight(!paddingRight);
        }}
      >
        &times;
      </div>

      <div className="sidebar__items">
        <div className="sidebar__logo dark:text-white">
          <h3 style={{width: 180}}>
          <img src={LIOE} style={{width: 30, height: 30, marginRight: 10, display: "inline-block"}}></img><span style={{ color: "#f7c522" }}>LioE</span>
          </h3>
        </div>

        <Link
          onClick={() => {
            setShowBar(false);
            setPaddingLeft(!paddingLeft);
            setPaddingRight(!paddingRight);
          }}
          to="/"
          className={`sidebar__item ${isHome && "sidebar--active"}`}
        >
          <HomeFilled
            className={`${isHome && "dark:bg-shark-500 dark:rounded-lg`"}`}
          />
          <div className={`${isHome && "dark:text-white"}`}>Farm Pools</div>
        </Link>

        {/*<Link
          onClick={() => {
            setShowBar(false);
            setPaddingLeft(!paddingLeft);
            setPaddingRight(!paddingRight);
          }}
          to="/supply"
          className={`sidebar__item ${
            isSupply && "sidebar--active dark:text-white"
          }`}
        >
          <CreditCardFilled
            className={`${isSupply && "dark:bg-shark-500 dark:rounded-lg`"}`}
          />
          <div className={`${isSupply && "dark:text-white"}`}>
            Lend and earn
          </div>
        </Link>*/}

        <Link
          onClick={() => {
            setShowBar(false);
            setPaddingLeft(!paddingLeft);
            setPaddingRight(!paddingRight);
          }}
          to="/stake"
          className={`sidebar__item ${isStake && "sidebar--active"}`}
        >
          <ThunderboltFilled
            className={`${isStake && "dark:bg-shark-500 dark:rounded-lg`"}`}
          />
          <div className={`${isStake && "dark:text-white"}`}>Stake(Coming soon)</div>
        </Link>
      </div>

      {/* <div className="sidebar__bottom">
        <div className="sidebar__text">
          <QuestionCircleOutlined />
          <span style={{cursor: "pointer"}} onClick={() => {window.open("https://docs.canopus.network/yield-farming-and-staking/leveraged-yield-farming", '_blank')}}>User guide</span>
        </div>

        <TwitterOutlined onClick={() => {window.open("https://twitter.com/canopus_network", '_blank')}}/>
        <SendOutlined onClick={() => {window.open("https://t.me/canopus_network", '_blank')}}/>
        <MediumOutlined onClick={() => {window.open("https://canopusblog.medium.com/", '_blank')}}/>
      </div> */}
    </div>
  );
};

export default Sidebar;
