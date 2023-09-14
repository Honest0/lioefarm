import React, { useEffect, useState } from "react";
//import LockIcon from "@material-ui/icons/Lock";
//import FlareRoundedIcon from "@material-ui/icons/FlareRounded";
import Web3 from 'web3';
import { poolBSC } from "../data/pools";
import { useStateValue } from "../StateProvider";
//import LIOE from "../images/LIOE.png";
import Ibnb from "../images/iBNB.png";
import Ibusd from "../images/iBUSD.png";
import ILioe from "../images/LIOE.png";
import TopBar from "./../components/TopBar";
import Button from "../components/common/Button";
import "./styles/Stake.css";
import "./styles/StakeResponsive.css";
import {CHAIN_ID_LIST, ERC20_ABI, FARMING_ABI} from "../config.js";

const Stake = ({
  bar,
  setBar,
  showBar,
  setShowBar,
  paddingLeft,
  setPaddingLeft,
  paddingRight,
  setPaddingRight,
}) => {
  const [{ walletAddr, chainInfo }] = useStateValue();

  const [pool, setPool] = useState("BSC");
  const [poolData, setPoolData] = useState(poolBSC);
  const [connectedAddr, setConnectedAddr] = useState('');
  const [totalStakedToken, setTotalStakedToken] = useState(0);
  const [yourStakedToken, setYourStakedToken] = useState(0);
  const [yourTokenBal, setYourTokenBal] = useState(0);
  const [stakingAPY, setStakingAPY] = useState(0);
  const [satkeDailyAPR, setStakeDailyAPR] = useState(0);
  const [depositLioe, setDepositLioe] = useState(0)
  const [withdrawLioe, setWithdrawLioe] = useState(0)
  const [depositElioe, setDepositElioe] = useState(0)
  const [withdrawElioe, setWithdrawElioe] = useState(0)
  const [lioeStakeJoin, setLioeStakeJoin] = useState(false)
  const [elioeStakeJoin, setElioeStakeJoin] = useState(false)
  const [poolInfoSelected, setPoolInfoSelected] = useState({})
  const [pendingLioe, setPendingLioe] = useState(0)
  const [earnedLioe, setEarnedLioe] = useState(0)
  
  const validInputDepositLioe = (e) => {
    if (Number(e.target.value) < 0) {
      return;
    }
    
    if (yourTokenBal >= Number(e.target.value)) {
      setDepositLioe(Number(e.target.value))
    } else {
      return;
    }
  }

  const validInputWithdrawLioe = (e) => {
    if (Number(e.target.value) < 0) {
      return;
    }
    
    if (yourStakedToken >= Number(e.target.value)) {
      setWithdrawLioe(Number(e.target.value))
    } else {
      return;
    }
  }

  const validInputDepositElioe = () => {

  }
  
  const validInputWithdrawElioe = () => {

  }

  const approveLioe = () => {
    if (poolData && poolData.length > 0) {
      let web3 = new Web3(window.ethereum);
      const lpContract = new web3.eth.Contract(ERC20_ABI, poolData[0].lpAddr);
      const num256 = 10**30;
      const bigNumAmount = "0x"+num256.toString(16);
      lpContract.methods.approve(poolData[0].farmAddr, bigNumAmount).send({ from: walletAddr })
      .then(() => {
        setLioeStakeJoin(true)
      }).catch(() => {
        setLioeStakeJoin(false)
      })
    }
  }

  const stakeLioe = () => {
    if (poolData && poolData.length > 0) {
      let web3 = new Web3(window.ethereum);
      const lpContract = new web3.eth.Contract(FARMING_ABI, poolData[0].farmAddr);
      const num256 = 10**18 * depositLioe;
      const bigNumAmount = "0x"+num256.toString(16);
      lpContract.methods.enterStaking(bigNumAmount).send({ from: walletAddr })
      .then(() => {
        getStakingInfo()
      }).catch(() => {
      })
    }
  }

  const unstakeLioe = () => {
    if (poolData && poolData.length > 0) {
      let web3 = new Web3(window.ethereum);
      const lpContract = new web3.eth.Contract(FARMING_ABI, poolData[0].farmAddr);
      const num256 = 10**18 * withdrawLioe;
      const bigNumAmount = "0x"+num256.toString(16);
      lpContract.methods.leaveStaking(bigNumAmount).send({ from: walletAddr })
      .then(() => {
        getStakingInfo()
      }).catch(() => {
      })
    }
  }

  const switchNetwork = async (chainName) => {
    if (!window.ethereum || connectedAddr === "" || connectedAddr === "Connect") {
      setPool(chainName);
      let pool = poolBSC;
      setPoolData(pool);
      return;
    }

    let originParam = CHAIN_ID_LIST[0]
    const {buyUrl, ...chainParam} = originParam

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainParam],
      });
    } catch (addError) {
      // handle "add" error
    }
  };

  useEffect(() => {
    setPool(chainInfo.chainName ? chainInfo.chainName : "BSC")
    setConnectedAddr(walletAddr);
    if (chainInfo && chainInfo.chainId) {
      let selectedPools = poolBSC;
      console.log(selectedPools)
      setPoolData([...selectedPools]);
    }
    
    /*if (chainInfo && chainInfo.chainId) {
      let Pool;
      if (chainInfo.chainName === "BSC") {
        Pool = poolBSC;
      } else if (chainInfo.chainName === "Avalanche") {
        Pool = poolAvalanche;
      }
      let web3 = new Web3(chainInfo.rpcUrls[0])
      const routerContract = new web3.eth.Contract(ROUTER_ABI, Pool[0].routerAddr);
      routerContract.methods.getAmountsOut('1000000000000000000', [Pool[0].baseTokenAddr, Pool[0].usdAddr]).call(
      ).then((res) => {
        const basePrice = Number(res[1]) / Math.pow(10, Pool[0].usdDecimal);
        setBaseTokenInUsd(basePrice);
        console.log('base', basePrice)
        routerContract.methods.getAmountsOut('1000000000000000000', [Pool[0].token0, Pool[0].baseTokenAddr]).call(
        ).then((amount) => {
          setLioeTokenInUsd(amount[1] / Math.pow(10, 18) * basePrice)
          let lioePrice = amount[1] / Math.pow(10, 18) * basePrice
          getPoolInfos(basePrice, lioePrice)
        })
      }).catch(() => {
        setBaseTokenInUsd(0)
        setLioeTokenInUsd(0)
      })
    }*/
  }, [chainInfo, walletAddr])

  useEffect(() => {
    getStakingInfo();
  }, [poolData])

  const getStakingInfo = () => {
    if (poolData && poolData.length > 0) {
      console.log(poolData, walletAddr)
      if (walletAddr !== "" && walletAddr !== "Connect") {
        let stakePool = poolData[0];
        let web3 = new Web3(chainInfo.rpcUrls[0])
        const lpContract = new web3.eth.Contract(ERC20_ABI, stakePool.lpAddr)
        lpContract.methods.allowance(walletAddr, stakePool.farmAddr).call(
        ).then((allow) => {
          if (Number(allow) > 10000000000000000000000000000) {
            setLioeStakeJoin(true)
          } else {
            setLioeStakeJoin(false)
          }
        })
        lpContract.methods.balanceOf(stakePool.farmAddr).call(
        ).then((lpOfFarm) => {
          let totalStaked = Number(lpOfFarm) / Math.pow(10, stakePool.decimal1);
          setTotalStakedToken(totalStaked);
          let aprPerYear = (totalStaked === 0) ? 0 : (stakePool.totalTokenPerYear * stakePool.poolWeight) / totalStaked * 100;
          setStakingAPY(aprPerYear);
          setStakeDailyAPR(aprPerYear / 365)
        })
        lpContract.methods.balanceOf(walletAddr).call(
          ).then((lpOfWallet) => {
            let lpBal = Number(lpOfWallet) / Math.pow(10, stakePool.decimal1);
            setYourTokenBal(lpBal);
          })
        const farmContract = new web3.eth.Contract(FARMING_ABI, stakePool.farmAddr);
        farmContract.methods.userInfo(stakePool.pid, walletAddr).call(
        ).then((res) => {
          let staked = Number(res.amount) / Math.pow(10, stakePool.decimal1)
          setYourStakedToken(staked)
          if (staked >= 0) {
            farmContract.methods.pendingLioe(0, walletAddr).call(
            ).then((pendingRes) => {
              let pending = Number(pendingRes) / Math.pow(10, 18);
              setPendingLioe(pending)
            })
          }
          setEarnedLioe(Number(res.rewardDebt) / Math.pow(10, stakePool.decimal1))
        })
      }
    }
  }
  useEffect(() => {
    const fetchPoolInfos = setInterval(getStakingInfo, 5000)
    switchNetwork("BSC")
    return () => {
      clearInterval(fetchPoolInfos);
    }
  })

  return (
    <div className="stake">
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

      <div className="stake__body">
        <div className="stake__row">
          {/*<div className="stake__col-1">
            <div className="stake__card dark:bg-shark-light-500 dark:text-white">
              <div className="stake__card-body">
                <div className="stake__header dark:border-shark-500">
                  <span className="stake__title">
                    <img src={LIOE} alt="Lioe" />
                    Stake LIOE to earn LIOE
                  </span>

                  <span className="stake__num">
                    <p>0.00%</p>
                  </span>
                </div>
                <div
                  className="stake__header-text"
                  style={{ paddingBottom: "10px" }}
                >
                  <p>
                    Available LIOE Balance: <span>0.00</span>
                  </p>
                </div>

                <div className="stake__input">
                  <input
                    className="dark:bg-shark-500 dark:text-white"
                    type="number"
                    value="0"
                  />
                  <button
                    className="dark:bg-shark-500 dark:text-white"
                    type="button"
                    disabled
                  >
                    Stake
                  </button>
                </div>

                <div
                  style={{
                    display: "block",
                    paddingTop: "20px",
                    paddingBottom: "10px",
                  }}
                  className="stake__header-text"
                >
                  <p>
                    Available Unstake Balance: <span>0.00</span>
                  </p>
                  <p>
                    Total Staked Balance:{" "}
                    <span
                      className="dark:text-white"
                      style={{ fontWeight: "bold" }}
                    >
                      0.00
                    </span>
                  </p>
                </div>

                <div className="stake__input">
                  <input
                    className="dark:bg-shark-500 dark:text-white"
                    type="number"
                    value="0"
                  />
                  <button
                    className="dark:bg-shark-500 dark:text-white"
                    type="button"
                    disabled
                  >
                    Unstake
                  </button>
                </div>

                <button
                  className="stake__button dark:bg-shark-500 dark:text-white"
                  type="button"
                  disabled
                >
                  Claim 0.00 LIOE
                </button>
              </div>
            </div>

            <div className="stake__card dark:bg-shark-light-500 dark:text-white">
              <div className="stake__card-body">
                <div className="stake__header dark:border-shark-500">
                  <div className="stake__title">
                    <LockIcon />
                    <h2>Vesting LIOE</h2>
                  </div>
                </div>
                <div className="stake__header-text">
                  <p
                    style={{
                      textAlign: "start",
                      fontSize: "12px",
                      opacity: "0.5",
                      marginTop: "20px",
                    }}
                  >
                    How does the vesting work?
                    <br />
                    <br />
                    • All LIOE is vested for two months.
                    <br />
                    • You get LIOE rewards by providing liquidity or borrowing
                    on the platform.
                    <br />• Every user has an option to opt out the vesting
                    period with a 50% LIOE rewards burn at anytime
                  </p>
                </div>

                <button
                  style={{
                    fontSize: "12px",
                    marginBottom: "-20px",
                  }}
                  className="stake__button dark:bg-shark-500 dark:text-white"
                  type="button"
                  disabled
                >
                  Claim available with 50% burn (0.00 LIOE)
                </button>

                <button
                  className="stake__button dark:bg-shark-500 dark:text-white"
                  type="button"
                  disabled
                >
                  Claim available (0.00 LIOE)
                </button>
              </div>
            </div>
          </div>*/}

          <div className="stake__col-2">
            {/* <div className="stake__select dark:bg-shark-light-500 dark:text-white">
              <div
                className={`stake__select-option ${
                  pool === "Avalanche" && "stake__select-option--active"
                }`}
                onClick={() => switchNetwork("Avalanche")}
              >
                Avalanche
              </div>

              <div
                className={`stake__select-option ${
                  pool === "BSC" && "stake__select-option--active"
                }`}
                onClick={() => switchNetwork("BSC")}
              >
                BSC
              </div>
            </div> */}
            <div className="stake__card dark:bg-shark-light-500 dark:text-white">
              <div style={{ height: "235px" }} className="stake__card-body">
                {(
                  <>
                    <div className="stake__header dark:border-shark-500">
                      <span className="stake__title">
                        <img style={{ height: "24px" }} src={ILioe} alt="Lioe" />
                        Stake LioE to earn LioE
                      </span>

                      <span className="stake__num">
                        <h6>Total APR {stakingAPY.toFixed(4)}%</h6>
                        <h6>Daily APR {satkeDailyAPR.toFixed(4)}%</h6>
                      </span>
                    </div>

                    <div className="stake__header-text">
                      <p style={{ marginRight: "200px" }}>
                        Available LioE Balance: <span>{yourTokenBal}</span>
                      </p>
                      {lioeStakeJoin && <p>
                        Staked LioE Balance: <span>{yourStakedToken}</span>
                      </p>}
                    </div>

                    <div className="stake__header-body">
                      <div className="stake__input">
                        <input
                          className="dark:bg-shark-500 dark:text-white"
                          type="number"
                          value={depositLioe}
                          onChange={validInputDepositLioe}
                        />
                        <button
                          className="dark:bg-shark-500 dark:text-white"
                          style={{ marginRight: "20px" }}
                          type="button"
                          onClick={lioeStakeJoin ? () => {stakeLioe()} : () => {approveLioe()}}
                        >
                          {lioeStakeJoin ? "Stake" : "Approve"}
                        </button>
                      </div>

                      {lioeStakeJoin && <div className="stake__input">
                          <input
                            className="dark:bg-shark-500 dark:text-white"
                            type="number"
                            onChange={validInputWithdrawLioe}
                            value={withdrawLioe}
                          />
                          <button
                            className="dark:bg-shark-500 dark:text-white"
                            type="button"
                            onClick={() => {unstakeLioe()}}
                          >
                            Unstake
                          </button>
                      </div>}
                    </div>

                    <Button style={{ marginTop: "30px" }} onClick={stakeLioe}>Claim LioE : {pendingLioe}</Button>
                  </>
                )}
              </div>
            </div>


            {/*<div className="stake__card dark:bg-shark-light-500 dark:text-white">
              <div style={{ height: "235px" }} className="stake__card-body">
                <div className="stake__header dark:border-shark-500">
                  <span className="stake__title">
                    <img style={{ height: "24px" }} src={Ibusd} alt="Lioe" />
                    Stake iBNB to earn LIOE
                  </span>

                  <span className="stake__num">
                    <p>NAN%</p>
                  </span>
                </div>

                <div className="stake__header-text">
                  <p style={{ marginRight: "200px" }}>
                    Available iBUSD Balance: <span>NaN</span>
                  </p>
                  <p>
                    Staked iBUSD Balance: <span>NaN</span>
                  </p>
                </div>

                <div className="stake__header-body">
                  <div className="stake__input">
                    <input
                      className="dark:bg-shark-500 dark:text-white"
                      type="number"
                      value="0"
                    />
                    <button
                      className="dark:bg-shark-500 dark:text-white"
                      style={{ marginRight: "20px" }}
                      disabled
                      type="button"
                    >
                      Stake
                    </button>
                  </div>

                  <div className="stake__header-body">
                    <div className="stake__input">
                      <input
                        className="dark:bg-shark-500 dark:text-white"
                        type="number"
                        value="0"
                      />
                      <button
                        className="dark:bg-shark-500 dark:text-white"
                        type="button"
                        disabled
                      >
                        Unstake
                      </button>
                    </div>
                  </div>
                </div>

                <Button style={{ marginTop: "30px" }}>Vest NaN LIOE</Button>
              </div>
            </div>*/}

            {/*pool === "Avalanche" ? (
              <div className="stake__card dark:bg-shark-light-500 dark:text-white">
                <div style={{ height: "155px" }} className="stake__card-body">
                  <div className="stake__header dark:border-shark-500">
                    <div className="stake__title">
                      <FlareRoundedIcon />
                      <h2>Early User Airdrop</h2>
                    </div>
                  </div>
                  <div className="stake__header-text">
                    <p
                      style={{
                        fontSize: "12px",
                        opacity: "0.5",
                        marginTop: "15px",
                      }}
                    >
                      • The airdrop for early liquidity providers and borrowers
                      will be distributed in equal parts within 4 months
                      <br />
                      • Distribution will be happening every 2 weeks until the
                      entire 3% of supply is distributed
                      <br />• Come back later for the next airdrop!
                    </p>
                  </div>
                </div>
              </div>
            ) : null*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
