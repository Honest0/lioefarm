import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Web3 from 'web3';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel'
import { poolBSC } from "../data/pools";
// import Button from "../components/common/Button";
import TopBar from "../components/TopBar";
import HomeLight from "../images/home.png"
// import Giveaway from "../images/giveaway.png"
import BillboardLight from "../images/billboard-light.png";
import BillboardDark from "../images/billboard-dark.png";
import { useStateValue } from "../StateProvider";
import "./styles/Home.css";
import "./styles/HomeResponsive.css";
import {CHAIN_ID_LIST, ERC20_ABI, FARMING_ABI, ROUTER_ABI} from "../config.js";

const Home = ({
  bar,
  setBar,
  showBar,
  setShowBar,
  paddingLeft,
  setPaddingLeft,
  paddingRight,
  setPaddingRight,
}) => {
  const [{ theme, walletAddr, chainInfo }] = useStateValue();

  const [pool, setPool] = useState("BSC");
  const [poolData, setPoolData] = useState(poolBSC);

  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showLpModal, setShowLpModal] = useState(false);
  const [connectedAddr, setConnectedAddr] = useState('');
  const [baseTokenInUsd, setBaseTokenInUsd] = useState(0);
  const [lioeTokenInUsd, setLioeTokenInUsd] = useState(0);
  const [totalLockedOnChain, setTotallockedOnChain] = useState(0);
  const [yourAllTlvOnChain, setYourAllTlvOnChain] = useState(0);
  const [topAprFarm, setTopAprFarm] = useState({});
  const [yourTlvForTF, setYourTlvForTF] = useState(0);
  const [totalStakedToken, setTotalStakedToken] = useState(0);
  const [yourStakedToken, setYourStakedToken] = useState(0);
  const [stakingAPY, setStakingAPY] = useState(0);
  const [satkeDailyAPR, setStakeDailyAPR] = useState(0);
  const [poolInfoSelected, setPoolInfoSelected] = useState({})
  const [lpStakedCurrPool, setLpStakedCurrPool] = useState(0)
  const [lioeEarned, setLioeEarned] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [pendingLioe, setPendingLioe] = useState(0);
  const [willWithdraw, setWillWithdraw] = useState(false);
  const [lpBalCurrPool, setLpBalCurrPool] = useState(0);
  const [inputDeposit, setInputDeposit] = useState(0);
  const [inputWithdraw, setInputWithdraw] = useState(0);
  const [slideTime, setSlideTime] = useState(0);

  const enterFarm = (p) => {
    refreshPoolInfo(p)
    setPoolInfoSelected(p)
    setShowFarmModal(!showFarmModal)
  }
  const refreshPoolInfo = (p) => {
    if (walletAddr === "" || walletAddr === "Connect")
      return;

    if (!showFarmModal) {
      setPoolInfoSelected(p)
      let web3 = new Web3(window.ethereum)
      const farmContract = new web3.eth.Contract(FARMING_ABI, p.farmAddr);
      farmContract.methods.userInfo(p.pid, connectedAddr).call(
      ).then((res) => {
        let lp = Number(res.amount) / Math.pow(10, 18);
        let earned = Number(res.rewardDebt) / Math.pow(10, 18);
        setLpStakedCurrPool(lp)
        setLioeEarned(earned);
        if (lp > 0) {
          farmContract.methods.pendingShare(p.pid, connectedAddr).call(
          ).then((pendingRes) => {
            let pending = Number(pendingRes) / Math.pow(10, 18);
            setPendingLioe(pending)
          })
        }
      })
      const lpContract = new web3.eth.Contract(ERC20_ABI, p.lpAddr);
      lpContract.methods.balanceOf(connectedAddr).call(
      ).then((lpBal) => {
        setLpBalCurrPool(Number(lpBal) / Math.pow(10, 18));
      })
    }
  };

  const enableFarming = () => {
    setShowFarmModal(!showFarmModal)
    let web3 = new Web3(window.ethereum);
    const lpContract = new web3.eth.Contract(ERC20_ABI, poolInfoSelected.lpAddr);
    const num256 = 10**30;
    const bigNumAmount = "0x"+num256.toString(16);
    lpContract.methods.approve(poolInfoSelected.farmAddr, bigNumAmount).send({ from: walletAddr })
    .then(() => {
      let pool = poolInfoSelected;
      pool.joined = true;
      setPoolInfoSelected([...pool])
    }).catch(() => {
      //alert('error')
    })
  }

  const lpMove = (isWithdraw) => {
    setShowFarmModal(!showFarmModal)
    setShowLpModal(!showLpModal)
    setWillWithdraw(isWithdraw);
  }

  const onClickMax = () => {
    if (willWithdraw) {
      setInputWithdraw(lpStakedCurrPool)
    } else {
      setInputDeposit(lpBalCurrPool)
    }
  }

  const validInput = (e) => {
    if (Number(e.target.value) < 0) {
      return;
    }
    
    console.log(e.target.value, 'sss')
    if (willWithdraw) {
      if (lpStakedCurrPool >= Number(e.target.value)) {
        setInputWithdraw(Number(e.target.value))
      } else {
        return;
      }
    } else {
      if (lpBalCurrPool >= Number(e.target.value)) {
        setInputDeposit(Number(e.target.value))
      } else {
        return;
      }
    }
  }

  const withdraw = () => {
    setShowLpModal(!showLpModal)
    let web3 = new Web3(window.ethereum)
    const farmContract = new web3.eth.Contract(FARMING_ABI, poolInfoSelected.farmAddr);
    const num256 = 10**18 * inputWithdraw;
    const bigNumAmount = "0x"+num256.toString(16);
    farmContract.methods.withdraw(poolInfoSelected.pid, bigNumAmount).send({ from: walletAddr })
    .then(() => {
      refreshPoolInfo(poolInfoSelected);
    }).catch(() => {
      //alert('error')
    })
    setInputWithdraw(0)
  }

  const deposit = () => {
    setShowLpModal(!showLpModal)
    let web3 = new Web3(window.ethereum)
    const farmContract = new web3.eth.Contract(FARMING_ABI, poolInfoSelected.farmAddr);
    const num256 = 10**18 * inputDeposit;
    const bigNumAmount = "0x"+num256.toString(16);
    farmContract.methods.deposit(poolInfoSelected.pid, bigNumAmount).send({ from: walletAddr })
    .then(() => {
      refreshPoolInfo(poolInfoSelected);
    }).catch(() => {
      //alert('error')
    })
    setInputDeposit(0)
  }

  const harvest = () => {
    setShowFarmModal(!showFarmModal)
    let web3 = new Web3(window.ethereum)
    const farmContract = new web3.eth.Contract(FARMING_ABI, poolInfoSelected.farmAddr);
    const num256 = 10**30;
    const bigNumAmount = "0x"+num256.toString(16);
    farmContract.methods.deposit(poolInfoSelected.pid, 0).send({ from: walletAddr })
    .then(() => {
      refreshPoolInfo(poolInfoSelected);
    }).catch(() => {
      //alert('error')
    })
  }

  const switchNetwork = async (chainName) => {
    if (!window.ethereum) {
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

  function getPoolInfos(basePrice, lioePrice) {
    if (chainInfo && chainInfo.chainId) {
      let selectedPools = poolBSC;
      setPoolData([...selectedPools]);
      
      let web3 = new Web3(chainInfo.rpcUrls[0])
      for (let i = 1; i < selectedPools.length; i++) {
        if (selectedPools[i].token1 && selectedPools[i].token1 !== "") {
          const token1Contract = new web3.eth.Contract(ERC20_ABI, selectedPools[i].token1);
          token1Contract.methods.balanceOf(selectedPools[i].lpAddr).call(
          ).then((token1Bal) => {
            const lpContract = new web3.eth.Contract(ERC20_ABI, selectedPools[i].lpAddr);
            if (walletAddr && walletAddr !== "Connect" && walletAddr !== "" && !selectedPools[i].joined) {
              lpContract.methods.allowance(walletAddr, selectedPools[i].farmAddr).call(
              ).then((allow) => {
                if (Number(allow) > 10000000000000000000000000000) {
                  selectedPools[i].joined = true;
                  setPoolData([...selectedPools])
                }
              })
            }
            lpContract.methods.totalSupply().call(
            ).then((ts) => {
              lpContract.methods.balanceOf(selectedPools[i].farmAddr).call(
              ).then((farmLp) => {
                const share = Number(farmLp) / Number(ts);
                const routerContract = new web3.eth.Contract(ROUTER_ABI, selectedPools[i].routerAddr);
                if (selectedPools[i].token1.toLowerCase() === selectedPools[i].usdAddr.toLowerCase()) {
                  selectedPools[i].tvl = Number(token1Bal) / Math.pow(10, selectedPools[i].decimal1) * 2 * share;
                  selectedPools[i].total = (selectedPools[i].tvl) ? (selectedPools[i].totalTokenPerYear * selectedPools[i].poolWeight * lioePrice) / selectedPools[i].tvl : 0;
                  selectedPools[i].daily = selectedPools[i].total / 365;
                  setPoolData([...selectedPools])
                } else {
                  /*routerContract.methods.getAmountsOut('1000000000000000000', [selectedPools[i].baseTokenAddr, selectedPools[i].usdAddr]).call(
                  ).then((res) => {
                    const baseTokenInUsd = Number(res[1]) / Math.pow(10, selectedPools[i].usdDecimal);*/
                    if (basePrice > 0) {
                      if (selectedPools[i].token1.toLowerCase() === selectedPools[i].baseTokenAddr.toLowerCase()) {
                        selectedPools[i].tvl = Number(token1Bal) / Math.pow(10, selectedPools[i].decimal1) * basePrice * 2 * share;
                        selectedPools[i].total = (selectedPools[i].tvl) ? (selectedPools[i].totalTokenPerYear * selectedPools[i].poolWeight * lioePrice) / selectedPools[i].tvl : 0;
                        selectedPools[i].daily = selectedPools[i].total / 365;
                        setPoolData([...selectedPools])
                      } else {
                        routerContract.methods.getAmountsOut(token1Bal, [selectedPools[i].token1, selectedPools[i].baseTokenAddr]).call(
                        ).then((token1InMain) => {
                          selectedPools[i].tvl = Number(token1InMain[1]) / Math.pow(10, 18) *  basePrice * 2 * share;
                          selectedPools[i].total = (selectedPools[i].tvl) ? (selectedPools[i].totalTokenPerYear * selectedPools[i].poolWeight * lioePrice) / selectedPools[i].tvl : 0;
                          selectedPools[i].daily = selectedPools[i].total / 365;
                          setPoolData([...selectedPools])
                        }).catch((err) => {
                        });
                      }
                    }
                  /*}).catch((err) => {
                    alert(err)
                  });*/
                }
              })
            })
          })
        }       
      }
    }
  }

  useEffect(() => {
    getPoolInfos()
    switchNetwork("BSC")
  }, []);

  useEffect(() => {
    setPool(chainInfo.chainName ? chainInfo.chainName : "BSC")
    setConnectedAddr(walletAddr);

    if (chainInfo && chainInfo.chainId) {
      let Pool = poolBSC;
      let web3 = new Web3(chainInfo.rpcUrls[0])
      const routerContract = new web3.eth.Contract(ROUTER_ABI, Pool[0].routerAddr);
      routerContract.methods.getAmountsOut('1000000000000000000', [Pool[0].baseTokenAddr, Pool[0].usdAddr]).call(
      ).then((res) => {
        const basePrice = Number(res[1]) / Math.pow(10, Pool[0].usdDecimal);
        setBaseTokenInUsd(basePrice);
        console.log('base', basePrice)
        routerContract.methods.getAmountsOut('1000000000', [Pool[0].token0, Pool[0].baseTokenAddr]).call(
        ).then((amount) => {
          setLioeTokenInUsd(amount[1] / Math.pow(10, 18) * basePrice)
          let lioePrice = amount[1] / Math.pow(10, 18) * basePrice
          getPoolInfos(basePrice, lioePrice)
        })
      }).catch(() => {
        setBaseTokenInUsd(0)
        // setLioeTokenInUsd(0)
      })
    }
  }, [chainInfo, walletAddr])

  useEffect(() => {
    const fetchPoolInfos = setInterval(() => {
      getPoolInfos(baseTokenInUsd, lioeTokenInUsd)
    }, 10000);

    function getBasicPrices() {
      if (chainInfo && chainInfo.chainId) {
        let Pool = poolBSC;
        let web3 = new Web3(chainInfo.rpcUrls[0])
        const routerContract = new web3.eth.Contract(ROUTER_ABI, Pool[0].routerAddr);
        routerContract.methods.getAmountsOut('1000000000000000000', [Pool[0].baseTokenAddr, Pool[0].usdAddr]).call(
        ).then((res) => {
          const basePrice = Number(res[1]) / Math.pow(10, Pool[0].usdDecimal);
          setBaseTokenInUsd(basePrice);
          routerContract.methods.getAmountsOut('1000000000', [Pool[0].token0, Pool[0].baseTokenAddr]).call(
          ).then((amount) => {
            setLioeTokenInUsd(amount[1] / Math.pow(10, 18) * basePrice)
          })
        }).catch(() => {
          setBaseTokenInUsd(0)
          setLioeTokenInUsd(0)
        })
      }
    }

    getBasicPrices();
    const fetchBasicPrices = setInterval(getBasicPrices, 6000);

    return () => {
      clearInterval(fetchPoolInfos);
      clearInterval(fetchBasicPrices);
    }
  })

  const getYourAllTvl = async (poolDataInfo) => {
    let yourAllTvl = 0;
    for (let i = 1; i < poolDataInfo.length; i++) {
      const element = poolDataInfo[i];
      let web3 = new Web3(chainInfo.rpcUrls[0])
      const farmContract = new web3.eth.Contract(FARMING_ABI, element.farmAddr);
      let res = await farmContract.methods.userInfo(element.pid, connectedAddr).call()
      const lpContract = new web3.eth.Contract(ERC20_ABI, element.lpAddr)
      let lpOfFarm = await lpContract.methods.balanceOf(element.farmAddr).call()
      let share = 0;
      if (lpOfFarm === 0) {
        share = Number(res.amount) / Number(lpOfFarm);
      }
      yourAllTvl = yourAllTvl + share * element.tvl
    }
    setYourAllTlvOnChain(yourAllTvl)
  }

  useEffect(() => {
    axios.post("https://api.ancient.cash/totalFarmReward", {
      publicAddress:connectedAddr,
      farmNumber: 1
    }).then((response)=>{
       setTotalReward(response.data.message.total/Math.pow(10,9));
    })
    .catch(err=>{
      console.log(err);
    })
  }, [connectedAddr]);

  useEffect(() => {
    if (poolData && poolData.length > 0) {
      let farmForTopApr;
      let allTvl = 0;
      for (let i = 1; i < poolData.length; i++) {
        if (poolData[i].tvl) {
          allTvl = allTvl + poolData[i].tvl
        }
        if (!farmForTopApr || (poolData[i].total > farmForTopApr.total && poolData[i].total > 0)) {
          farmForTopApr = poolData[i]
        }
      }
      setTotallockedOnChain(allTvl)
      if (connectedAddr !== "" && connectedAddr !== "Connect") {
        getYourAllTvl(poolData)
      }
      if (farmForTopApr && farmForTopApr.total > 0){
        console.log('top farming!!!!!!!!!!!!!!!!!!!!!!!!', farmForTopApr)
        setTopAprFarm(farmForTopApr)
        if (connectedAddr !== "" && connectedAddr !== "Connect") {
          let web3 = new Web3(chainInfo.rpcUrls[0])
          const farmContract = new web3.eth.Contract(FARMING_ABI, farmForTopApr.farmAddr);
          farmContract.methods.userInfo(farmForTopApr.pid, connectedAddr).call(
          ).then((res) => {
            console.log(res.amount, typeof(res.amount))
            const lpContract = new web3.eth.Contract(ERC20_ABI, farmForTopApr.lpAddr)
            lpContract.methods.balanceOf(farmForTopApr.farmAddr).call(
            ).then((lpOfFarm) => {
              const share = Number(res.amount) / Number(lpOfFarm);
              setYourTlvForTF(share * farmForTopApr.tvl)
            })          
          })
        }
      }

      // let web3 = new Web3(chainInfo.rpcUrls[0])
      // let stakePool = poolData[0];
      // const lpContract = new web3.eth.Contract(ERC20_ABI, stakePool.lpAddr)
      // lpContract.methods.balanceOf(stakePool.farmAddr).call(
      // ).then((lpOfFarm) => {
      //   let totalStaked = Number(lpOfFarm) / Math.pow(10, stakePool.decimal1);
      //   setTotalStakedToken(totalStaked);
      //   let aprPerYear = (totalStaked === 0) ? 0 : (stakePool.totalTokenPerYear * stakePool.poolWeight) / totalStaked * 100;
      //   setStakingAPY(aprPerYear);
      //   setStakeDailyAPR(aprPerYear / 365)
      //   if (connectedAddr !== "" && connectedAddr !== "Connect") {
      //     const farmContract = new web3.eth.Contract(FARMING_ABI, stakePool.farmAddr);
      //     farmContract.methods.userInfo(stakePool.pid, connectedAddr).call(
      //     ).then((res) => {
      //       setYourStakedToken(Number(res.amount) / Math.pow(10, stakePool.decimal1))
      //     })
      //   }
      // })
    }
  }, [poolData])


  return (
    <div className="home">
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

      <div className="home__body">
        <div className="home__row">
          <div className="home__col-1">
            <Carousel fade>
            <Carousel.Item>
            <div className="home__card dark:bg-shark-light-500">
              <div className="home__card-body">
                <h2 className="dark:text-white">
                  LioE Yield Farming & Staking
                </h2>

                <p className="dark:text-white">
                Utilize funds supplied by other users to earn up to 1000% APY on LioE Yield Farming and Staking. 
                Take your Investment to the next level.
                </p>
                <div className="home__card-buttons">
                  <button className="home__card-btn">Start farming</button>
                </div>
              </div>
              <div className="home__card-image-container">
                <figure
                  className="home__card-image"
                  style={{
                    backgroundImage: `url(${
                      theme === "dark" ? HomeLight : HomeLight
                    })`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "right center",
                  }}
                >
                  {<img
                    src={`${theme === "dark" ? HomeLight : HomeLight}`}
                    alt="billboard"
                  />}
                </figure>
              </div>
            </div>
            </Carousel.Item>
            {/* <Carousel.Item>
            <div className="home__card-extra dark:bg-shark-light-500" onClick={() => {window.open('https://canlioeblog.medium.com/1000-canlioe-liquidity-competition-on-pangolin-3rd-round-33d55922dc5b', '_blank')}}>
            </div>
            </Carousel.Item> */}
            </Carousel>
          </div>

          <div className="home__col-2">
            <div className="home__card dark:bg-shark-light-500">
              <div className="home__card-info">
                <div className="home__info-half">
                  <div
                    className="info-box"
                    style={{ marginRight: "10px !important" }}
                  >
                    <div className="dark:bg-shark-500">
                      <span
                        className="dark:text-white"
                        style={{ opacity: "0.5" }}
                      >
                        Total Locked Value:
                      </span>
                      <p
                        className="dark:text-white"
                        style={{
                          paddingBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                        
                        ${(!poolData || !poolData.length) ? 0.00 : totalLockedOnChain.toFixed(4)}
                      </p>

                      <span
                        className="dark:text-white"
                        style={{ opacity: "0.5" }}
                      >
                        Your TLV:
                      </span>
                      <p
                        className="dark:text-white"
                        style={{ fontWeight: "600" }}
                      >
                        $ {yourAllTlvOnChain.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div
                    className="info-box"
                    style={{ marginRight: "10px !important" }}
                  >
                    <div className="info-active dark:bg-shark-500">
                      <span className="dark:text-white">Top APR:</span>
                      <p
                        className="dark:text-white"
                        style={{ paddingBottom: "10px", fontWeight: "600" }}
                      >
                        {(!topAprFarm.total) ? 0 : Number(topAprFarm.total * 100).toFixed(3)}%
                      </p>

                      <span className="dark:text-white">Top Farm:</span>
                      <p
                        className="dark:text-white"
                        style={{ fontWeight: "600" }}
                      >
                        {(topAprFarm && topAprFarm.name) ? topAprFarm.name : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="home__info-half">
                  {/* <div
                    className="info-box"
                    style={{ marginRight: "10px !important" }}
                  >
                    <div className="dark:bg-shark-500">
                      <span
                        className="dark:text-white"
                        style={{ opacity: "0.5" }}
                      >
                        Total Staked LioE:
                      </span>
                      <p
                        className="dark:text-white"
                        style={{
                          paddingBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {(!totalStakedToken) ? 0 : Number(totalStakedToken).toFixed(0)}
                      </p>

                      <span
                        className="dark:text-white"
                        style={{ opacity: "0.5" }}
                      >
                        Your Staked LioE:
                      </span>
                      <p
                        className="dark:text-white"
                        style={{ fontWeight: "600" }}
                      >
                        {(connectedAddr === "" || connectedAddr === "Connect" || !yourStakedToken) ? 0 : Number(yourStakedToken).toFixed(0)}
                      </p>
                    </div>
                  </div> */}

                  <div
                    className="info-box"
                    style={{ textAlign:"center" }}
                  >
                    <div className="dark:bg-shark-500">
                      <span
                        className="dark:text-white"
                        style={{ marginTop: "100px !important", opacity: "1" }}
                      >
                           
                      </span>
                      <span
                        className="dark:text-white"
                        style={{ marginTop: "100px !important", opacity: "0.5" }}
                      >
                        LioE price:
                      </span>
                      <p
                        className="dark:text-white"
                        style={{
                          paddingBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                        ${(!lioeTokenInUsd) ? 0 : Number(lioeTokenInUsd).toFixed(4)}
                      </p>
                      <p
                        className="dark:text-white"
                        style={{
                          paddingBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                           
                      </p>
                    </div>
                  </div>
                  <div
                    className="info-box"
                    style={{ textAlign:"center" }}
                  >
                    <div className="dark:bg-shark-500">
                      <span
                        className="dark:text-white"
                        style={{ marginTop: "100px !important", opacity: "1" }}
                      >
                          
                      </span>
                      <span
                        className="dark:text-white"
                        style={{ marginTop: "100px !important", opacity: "0.5" }}
                      >
                        Farming Contract:
                      </span>
                      <a
                        href="https://bscscan.com/address/0xe77310c403576C7a21afa7Bd3b4AE4BCFC16bdc8"
                        target="blank"
                        className="dark:text-white"
                        style={{
                          paddingBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {poolData[0].farmAddr.slice(0,7)}...{poolData[0].farmAddr.slice(-4)}
                      </a>
                      <p
                        className="dark:text-white"
                        style={{
                          paddingBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                           
                      </p>
                    </div>
                  </div>
                  {/* <div
                    className="info-box"
                    style={{ marginRight: "10px !important" }}
                  >
                    <div className="dark:bg-shark-500">
                      <span
                        className="dark:text-white"
                        style={{ opacity: "0.5" }}
                      >
                        LioE APR:
                      </span>
                      <p
                        className="dark:text-white"
                        style={{
                          paddingBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {(!stakingAPY) ? 0 : stakingAPY.toFixed(4)}%
                      </p>

                      <span
                        className="dark:text-white"
                        style={{ opacity: "0.5" }}
                      >
                        LioE Daily:
                      </span>
                      <p
                        className="dark:text-white"
                        style={{ fontWeight: "600" }}
                      >
                        {(!satkeDailyAPR) ? 0 : satkeDailyAPR.toFixed(4)}%
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home__row">
          <div className="home__options">
            <h1 className="dark:text-white">All active pools</h1>
            <div className="home__select dark:bg-shark-light-500">
              <div
                className={`home__select-option ${
                  pool === "BSC" && "home__select-option--active"
                }`}
              >
                Binance Smart Chain
              </div>
            </div>
            <Modal
              show={showFarmModal}
              onHide={() => setShowFarmModal(!showFarmModal)}
              style={{ borderRadius: "50px" }}
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header
                className="dark:bg-shark-light-500 dark:text-white dark:border-shark-500"
                closeButton
              >
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  Farm {poolInfoSelected.name} Pool
                </h2>
              </Modal.Header>

              <Modal.Body className="dark:bg-shark-light-500 dark:text-white dark:border-shark-500">
                <div className="modal__body">
                  <div className="modal__items">
                    <div className="modal__item">
                      <p>Total Locked Value</p>
                      <span>${Number(poolInfoSelected.tvl).toFixed(4)}</span>
                    </div>
                    <div className="modal__item">
                      <p>Your TLV</p>
                      <span>${yourAllTlvOnChain.toFixed(4)}</span>
                    </div>
                    <div className="modal__item">
                      <p>Daily APR</p>
                      <span>{Number(poolInfoSelected.daily * 100).toFixed(3)}%</span>
                    </div>

                    <div className="modal__item">
                      <p>Total APR</p>
                      <span>{Number(poolInfoSelected.total * 100).toFixed(3)}%</span>
                    </div>

                    {/* <div className="modal__item">
                      <p>Referral Percentage</p>
                      <span><span>{poolInfoSelected.referral}</span>}</span>
                    </div> */}

                    <div className="modal__item">
                      <p>Reward token</p>
                      <span>{poolInfoSelected.rewardToken}</span>
                    </div>

                    <div className="modal__item">
                      <p>Total reward</p>
                      <span>{totalReward ? totalReward.toFixed(10) : 0} {poolInfoSelected.rewardToken}</span>
                    </div>

                    <div className="modal__item">
                      <p>Pending reward</p>
                      <span>{pendingLioe.toFixed(10)} {poolInfoSelected.rewardToken}</span>
                    </div>
                  </div>
                </div>
                {poolInfoSelected.joined && 
                <>
                  <div className="info dark:text-white">
                    <span
                      style={{ marginTop: "5px" }}
                    >
                      {poolInfoSelected.name} LP Staked&nbsp;
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#f7c522",
                        }}
                      >
                        {lpStakedCurrPool.toFixed(4)}
                      </span>
                    </span>
                    <div className="pool__leverage">
                      <div className="int-input" onClick={() => {lpMove(true)}}>
                        <span
                          className="int-btn"
                        >
                          -
                        </span>
                      </div>
                      <div className="int-input" style={{marginLeft: 10}} onClick={() => {lpMove(false)}}>
                        <span
                          className="int-btn"
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="info dark:text-white">
                    <button
                      className="pool__cta-btn"
                      onClick={harvest}
                    >
                      Harvest
                    </button>
                  </div>

                  {/*<div
                    style={{ marginBottom: "20px" }}
                    className="supply__input dark:bg-shark-500 dark:text-white"
                  >
                    <input
                      className="dark:text-white"
                      type="number"
                      value="0"
                    />
                    <span className="opacity-50" style={{marginRight: 10}}>Max</span>
                  </div>*/}
                </>}
                {!poolInfoSelected.joined &&<div
                  style={{ marginBottom: "20px" }}
                  className="supply__input dark:bg-shark-500 dark:text-white"
                >
                  <button
                    className="pool__cta-btn"
                    onClick={() => {enableFarming()}}
                  >
                    Enable farming
                  </button>
                </div>}
              </Modal.Body>   
            </Modal>

            <Modal
              show={showLpModal}
              onHide={() => setShowLpModal(!showLpModal)}
              style={{ borderRadius: "50px" }}
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header
                className="dark:bg-shark-light-500 dark:text-white dark:border-shark-500"
                closeButton
              >
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  Farm {poolInfoSelected.name} Pool
                </h2>
              </Modal.Header>

              <Modal.Body className="dark:bg-shark-light-500 dark:text-white dark:border-shark-500">
                <div className="modal__body">
                </div>
                
                {willWithdraw ? <div className="info dark:text-white">
                  <span
                    style={{ marginTop: "5px" }}
                  >
                    {poolInfoSelected.name} LP Staked&nbsp;
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#f7c522",
                      }}
                    >
                      {lpStakedCurrPool.toFixed(4)}
                    </span>
                  </span>
                </div>
                : <div className="info dark:text-white">
                  <span
                    style={{ marginTop: "5px" }}
                  >
                    {poolInfoSelected.name} LP Balance&nbsp;
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#f7c522",
                      }}
                    >
                      {lpBalCurrPool.toFixed(4)}
                    </span>
                  </span>
                </div>}
                <div
                  style={{ marginBottom: "20px" }}
                  className="supply__input dark:bg-shark-500 dark:text-white"
                >
                  <input
                    className="dark:text-white"
                    type="number"
                    value={willWithdraw ? inputWithdraw : inputDeposit}
                    onChange={validInput}
                  />
                  <span className="opacity-50" style={{marginRight: 10, cursor: "pointer"}} onClick={onClickMax}>Max</span>
                </div>
                <div className="info dark:text-white">
                  <button
                    className="pool__cta-btn"
                    onClick={willWithdraw ? () => {withdraw()} : () => {deposit()}}
                  >
                    {willWithdraw ? "Withdraw" : "Deposit"}
                  </button>
                </div>
              </Modal.Body>   
            </Modal>

            <div className="home__data">
              {
                <>
                  {poolData.slice(1, poolData.length).map((p, i) => (
                    <div
                      className="pool home__card dark:bg-shark-light-500 dark:text-white"
                      key={i}
                    >
                      <h2 className="dark:border-shark-500">
                        {p.title}
                        <img src={p.images[0]} alt="billboard" style={{width: 26, height: 26, display: "inline", marginLeft: 10, marginRight: -10}}/>
                        <img src={p.images[1]} alt="billboard" style={{width: 26, height: 26, display: "inline"}}/>
                      </h2>

                      <div className="pool__body">
                        <h3>{i===0 ? `Add  ${p.name}  to  earn  ${p.rewardToken}` : `${p.name} (Coming  soon)`}</h3>

                        <p className="pool__info">
                          <span>Total Locked Value</span>
                          <span>${Number(p.tvl).toFixed(4)}</span>
                        </p>
                        <p className="pool__info">
                          <span>Your TLV</span>
                          <span>${yourAllTlvOnChain.toFixed(3)}</span>
                        </p>
                        <p className="pool__info">
                          <span>Daily APR</span>
                          <span>{Number(p.daily * 100).toFixed(3)}%</span>
                        </p>

                        <p className="pool__info">
                          <span>Total APR</span>
                          <span>{Number(p.total * 100).toFixed(3)}%</span>
                        </p>

                        {/* <p className="pool__info">
                          <span>Referral Percentage</span>
                          <span>{p.referral}</span>}
                        </p> */}

                        <p className="pool__tokens">
                          <span>Reward token</span>
                          <span>{p.rewardToken}</span>
                        </p>
                        <p className="pool__tokens">
                          <span>Total reward</span>
                          <span>{p.name === "LioE/BNB" ? (totalReward ? totalReward.toFixed(10) : 0) : Number(0).toFixed(10)} {p.rewardToken}</span>
                        </p>
                        <p className="pool__tokens">
                          <span>Pending reward</span>
                          <span>{p.name === "LioE/BNB" ? pendingLioe.toFixed(10) : Number(0).toFixed(10)} {p.rewardToken}</span>
                        </p>
                      </div>
                      <div className="pool__cta" style={{marginTop: 15, marginBottom: 15}}>
                        <button
                          className="pool__cta-btn"
                          onClick={() => {window.open(p.lpUrl, '_parent')}}
                        >
                          Add {p.name} Liquidity
                        </button>
                      </div>

                      <div className="pool__cta">
                        <button
                          className="pool__cta-btn"
                          onClick={() => enterFarm(p)}
                        >
                          {p.joined ? "Farm now" : "Enable Farming"}
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
