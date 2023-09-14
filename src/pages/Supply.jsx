import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import Button from "../components/common/Button";
import TopBar from "../components/TopBar";
import "./styles/Supply.css";
import "./styles/SupplyResponsive.css";

const Supply = ({
  bar,
  setBar,
  showBar,
  setShowBar,
  paddingLeft,
  setPaddingLeft,
  paddingRight,
  setPaddingRight,
}) => {
  const [convert, setConvert] = useState(0);
  const [pool, setPool] = useState("BUSD");
  const [val, setVal] = useState(pool);

  return (
    <div className="supply">
      <TopBar
        bar={bar}
        setBar={setBar}
        showBar={showBar}
        setShowBar={setShowBar}
        paddingLeft={paddingLeft}
        setPaddingLeft={setPaddingLeft}
        paddingRight={paddingRight}
        setPaddingRight={setPaddingRight}
      />

      <div className="supply__body">
        <div className="supply__selection">
          <div className="supply__select dark:bg-shark-light-500 dark:text-white">
            <div
              className={`supply__select-option ${
                pool === "BNB" && "supply__select-option--active"
              }`}
              onClick={() => setPool("BNB")}
            >
              BNB
            </div>

            <div
              className={`supply__select-option ${
                pool === "BUSD" && "supply__select-option--active"
              }`}
              onClick={() => setPool("BUSD")}
            >
              BUSD
            </div>
          </div>

          <div className="supply__card dark:bg-shark-light-500 dark:text-white">
            <div className="supply__card-body">
              <h2 className="dark:border-shark-500">Deposit {pool}</h2>

              <div className="info dark:text-white">
                <span className="opacity-50">Convert from</span>
                <span className="opacity-50">0.000000 {pool}</span>
              </div>

              <div className="supply__input dark:bg-shark-500 dark:text-white">
                <input className="dark:text-white" type="number" value="0" />

                <FormControl variant="outlined" className="input-form">
                  <Select value={pool} onChange={(e) => setVal(e.target.value)}>
                    <MenuItem value={pool}>{pool}</MenuItem>
                    <MenuItem value={"i" + pool}>i{pool}</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="supply__values dark:text-white">
                <span className="opacity-50">25%</span>
                <span className="opacity-50">50%</span>
                <span className="opacity-50">75%</span>
                <span className="opacity-50">100%</span>
              </div>

              <div className="supply__receive">
                <span className="dark:text-white opacity-50">To receive</span>

                <div className="supply__inputs">
                  <div className="supply__input dark:bg-shark-500 dark:text-white">
                    <input
                      className="dark:text-white"
                      type="text"
                      value="0.000000"
                      onChange={(e) => setConvert(e.target.value)}
                    />
                  </div>

                  <button
                    className="supply__btn dark:bg-shark-500 dark:text-white"
                    disabled
                  >
                    Convert
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="supply__card dark:bg-shark-light-500 dark:text-white">
            <div className="supply__card-body">
              <h2 className="dark:border-shark-500">
                <span>Your i{pool} Holding</span>

                <Link to="/stake">
                  <Button>Stake</Button>
                </Link>
              </h2>

              <div className="supply__info">
                <div>
                  <span className="dark:text-white opacity-50">Balance</span>
                  <span className="dark:text-white">0.000000 i{pool}</span>
                </div>

                <div>
                  <span className="dark:text-white opacity-50">
                    Total {pool} value
                  </span>
                  <span className="dark:text-white">NaN {pool}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="supply__stats">
          <div className="supply__card dark:bg-shark-light-500 dark:text-white">
            <div className="supply__card-body">
              <h2 className="dark:border-shark-500">Global Stats</h2>

              <div className="supply__stat">
                <div className="div">
                  <div className="circular-progress">
                    <span>Utilization</span>
                    <h3>NaN%</h3>
                  </div>
                </div>

                <p className="stat-details dark:text-white">
                  Percentage of {pool} utilized as debt versus the total {pool}
                  liquidity under i{pool} pool
                </p>
              </div>

              <div className="supply__stat-info">
                <p>
                  <span className="stat-span dark:text-white">
                    Total {pool} Deposited
                  </span>
                  <span>0.00 {pool}</span>
                </p>

                <p>
                  <span className="stat-span dark:text-white">
                    Total debit issued
                  </span>
                  <span>0.00 {pool}</span>
                </p>

                <p>
                  <span className="stat-span dark:text-white">Lending APR</span>
                  <span>0.00%</span>
                </p>

                <p>
                  <span className="stat-span dark:text-white">Staking APR</span>
                  <span>0.00%</span>
                </p>

                <p>
                  <span className="stat-span dark:text-white">Total APR</span>
                  <span>0.00%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supply;
