import {CHAIN_ID_LIST} from './config.js'

export const initialState = {
  theme: localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark",
  walletAddr: "Connect",
  chainInfo: CHAIN_ID_LIST[0]
};

const reducer = (state, action) => {
  console.log(":::", action);
  switch (action.type) {
    case "SWITCH_THEME":
      console.log(">>>", state, action);

      const root = window.document.documentElement;
      root.className = "";

      if (state.theme === "dark") {
        root.classList.add("light");
        localStorage.setItem("theme", "light");

        return {
          ...state,
          theme: "light",
        };
      }

      root.classList.add("dark");
      localStorage.setItem("theme", "dark");

      return {
        ...state,
        theme: "dark",
      };

    case "walletChanged":
        //console.log('walletchanged', action.payload)
        return {...state, walletAddr: action.payload};

    case "chainChanged":
        if (action.payload.chainInfo) {
          //console.log('chainChanged', action.payload.chainInfo)
          return {...state, ...action.payload};
        }

    default:
      return state;
  }
};

export default reducer;
