import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

//Componentes
import ConnectButton from "../components/Contracts/ConnectButton";
import MintButton from "../components/Contracts/MintButton";

//Importa o ABI do contrato
import { contractABI } from "../components/contracts/contractABI.js";

export default function Home() {
  //Declara o objeto web3, o endereço da conta e o Contrato
  const [web3, setWeb3] = useState([]);
  const [address, setAddress] = useState([]);
  const [contract, setContract] = useState([]);

  //Handler para setters de estados
  function setStates(stateId, state) {
    switch (stateId) {
      case 1:
        setWeb3(state);
        break;

      case 2:
        setAddress(state);
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
    setAddress(ethereum.selectedAddress);
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

  useEffect(() => {
    //Seta o objeto web3
    let w3 = new Web3(ethereum);
    setWeb3(w3);
  }, [Web3, address]);

  useEffect(() => {
    if (web3.eth) {
      let c = new web3.eth.Contract(contractABI, contractAddress);
      setContract(c);
    }
  }, [web3.eth]);

  //Montagem do Componente
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
          address={address}
        />

        <h1>{address}</h1>
        <MintButton
          chainParams={params}
          address={address}
          contract={contract}
          web3={web3}
        />
      </main>

      <footer className={styles.footer}>
        <a href="#">Powered by SpectrYaw</a>
      </footer>
    </div>
  );
}
