import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

//Componentes
import ConnectButton from "../components/Contracts/ConnectButton";
import MintButton from "../components/Contracts/MintButton";
import CheckNFTs from "../components/contracts/CheckNFTs";

//Utils
import { checkNFT } from "../components/contracts/utils";

//Importa o ABI do contrato
import { contractABI } from "../components/contracts/contractABI.js";

export default function Home() {
  //Declara o objeto web3, o endereço da conta e o Contrato
  const [web3, setWeb3] = useState([]);
  const [address, setAddress] = useState([]);
  const [contract, setContract] = useState([]);

  //Variavel de estado para guardar os dados de todos os NFT's do usuário
  const [usersNfts, setUsersNfts] = useState([]);

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

      case 4:
        setUsersNfts(state);
        break;

      default:
        break;
    }
  }

  //Traz o Web3.js para a nossa página
  const Web3 = require("web3");

  //Declara o endereço do contrato que é providenciado assim que é dado o deploy nele
  const contractAddress = "0xF6c8d6B572DbBe45793A7Df12BD5004aF0edf1d7";

  //Parametros da rede - Caso seja Ethereum Mainnet apenas "chainId"
  const params = [
    {
      chainId: "0x539",
      chainName: "Local Ganache",
      nativeCurrency: {
        name: "ETHER",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["http://127.0.0.1:7545"],
    },
  ];

  //Executa a cada renderização
  useEffect(() => {
    //Caso a metamask esteja settada
    if (window.ethereum && ethereum.isMetaMask) {
      //Atualiza o endereço quando a pagina recarrega
      setAddress(ethereum.selectedAddress);

      //Eventos
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

  //Executa a cada Reload e a cada vez que o endereço da conta mudar
  useEffect(() => {
    if (window.ethereum && ethereum.isMetaMask) {
      //Instancia o objeto web3 de acordo com a instancia da ethereum injetada pela metamask
      const w3 = new Web3(ethereum);
      setWeb3(w3);
    }
  }, [Web3, address]);

  //Executa a cada reload e a cada vez que o objeto web3.eth mudar
  useEffect(() => {
    if (web3.eth) {
      //Instancia o contrato de acordo com o ABI e o Endereço fornecido
      const c = new web3.eth.Contract(contractABI, contractAddress);
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
          address={address}
        />

        <MintButton
          setStates={setStates}
          chainParams={params}
          address={address}
          contract={contract}
          checkNFT={checkNFT}
        />

        <CheckNFTs
          setStates={setStates}
          chainParams={params}
          address={address}
          contract={contract}
          nfts={usersNfts}
          checkNFT={checkNFT}
        />
      </main>

      <footer className={styles.footer}>
        <a href="#">Powered by SpectrYaw</a>
      </footer>
    </div>
  );
}
