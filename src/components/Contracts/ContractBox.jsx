import { useEffect, useState } from "react";

function ReadContract() {
  //Declara o objeto web3, o endereço da conta e o Contrato
  const [web3, setWeb3] = useState([]);
  const [address, setAddress] = useState([]);
  const [contract, setContract] = useState([]);

  //Traz o Web3.js para a nossa página
  const Web3 = require("web3");

  //Declara o Contract ABI que é um arquivo json providenciado pelo compilador de solidity assim que compilamos nosso contrato
  let abi = [];
  //Declara o endereço do contrato que é providenciado assim que é dado o deploy nele
  const contractAddress = "YOUR_CONTRACT_ADDRESS";

  //Verifica se a metamask ja injetou o web3 no browser
  useEffect(() => {
    //Caso tenha metamask
    if (window.ethereum) {
      ethereum
        //requisita acesso a conta do usuário
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          //seta a conta como padrão
          setAddress(accounts[0]);

          //seta a Chain
          ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x13881" }],
            })
            .catch((err) => {
              if (err.code === 4902) {
                console.log("Rede não adicionada ainda");

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
                ethereum
                  .request({
                    method: "wallet_addEthereumChain",
                    params,
                  })
                  .catch(() => {
                    window.location.reload();
                  });
              } else {
                window.location.reload();
              }
            });

          //Seta o contrato
          //let c = new w3.eth.Contract(abi, contractAddress);
          //setContract(c);
        })
        .then(() => {
          //Seta o objeto web3
          let w3 = new Web3(ethereum);
          setWeb3(w3);
        })
        .then(() => {
          //Eventos

          //Troca de Contas
          ethereum.on("accountsChanged", (accounts) => {
            setAddress(accounts[0]);
          });

          //Troca de chain
          ethereum.on("chainChanged", (chainId) => {
            console.log(chainId);
          });
        })
        .catch((err) => console.log(err));
    }
    //Caso não tenha metamask
    else {
      setAddress("Instale a MetaMask");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>{address}</h1>
    </>
  );
}

export default function ContractBox(props) {
  return (
    <div>
      <ReadContract />
    </div>
  );
}
