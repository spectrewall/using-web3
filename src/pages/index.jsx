import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import ConnectButton from "../components/Contracts/ConnectButton";

export default function Home() {
  //Declara o objeto web3, o endereço da conta e o Contrato
  const [web3, setWeb3] = useState([]);
  const [address, setAddress] = useState([]);
  const [contract, setContract] = useState([]);

  function setStates(stateId, state) {
    switch (stateId) {
      case 1:
        setWeb3(state);
        console.log("Set web3!");
        break;

      case 2:
        setAddress(state);
        console.log("Set Address: " + address);
        break;

      case 3:
        setContract(state);
        break;

      default:
        break;
    }
  }

  //Traz o Web3.js para a nossa página
  const Web3 = require("web3");

  //Declara o endereço do contrato que é providenciado assim que é dado o deploy nele
  const contractAddress = "0x3F96Ac6Ce8C6684E7Da37Ab8760FB095fA1A6c5A";

  //Parametros da rede - Caso seja Ethereum Mainnet apenas "chainId"
  const params = [
    {
      chainId: "0x13881",
      chainName: "Polygon Testnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
  ];

  //Atualiza o endereço da conta ativa a cada renderização
  useEffect(() => {
    try {
      setAddress(ethereum.selectedAddress);
    } catch (err) {
      console.log(err);
    }
  }, []);

  //Setta eventos sempre que a pagina renderizar
  useEffect(() => {
    //Caso a metamask esteja settada
    if (window.ethereum && ethereum.isMetaMask) {
      //Atualiza o endereço das contas quando são trocadas
      ethereum.on("accountsChanged", (accounts) => {
        setAddress(accounts[0]);
      });

      //Atualiza a chain
      ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
    }
  }, []);

  // useEffect(() => {
  //   try {
  //     //Seta o contrato
  //     let c = new web3.eth.Contract(contractAbi, contractAddress);
  //     setContract(c);

  //     console.log(address);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [web3, contract, address]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Reading Contract</title>
        <meta
          name="description"
          content="Page used to read ERC721 Smart Contracts"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ConnectButton
          setStates={setStates}
          chainParams={params}
          web3={Web3}
          contractInfo={contractAddress}
          address={address}
        />

        <h1>{address}</h1>
      </main>

      <footer className={styles.footer}>
        <a href="#">Powered by SpectrYaw</a>
      </footer>
    </div>
  );
}
