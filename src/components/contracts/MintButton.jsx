/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  names,
  animals,
} from "unique-names-generator";

export default function MintButton(props) {
  const [result, setResult] = useState([]);
  const [buttonActionId, setButtonActionId] = useState([]);

  //Chama a função de mint
  function mintNft() {
    //seta a Chain

    ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: props.chainParams[0].chainId }],
      })
      .catch((err) => {
        if (err.code === 4902) {
          //Adiciona a nova rede a metamask
          ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: props.chainParams,
            })
            .catch((err) => {
              window.location.reload();
            });
        } else {
          window.location.reload();
        }
      })
      .then(() => {
        //Cria nome para o NFT
        const nameConfig = {
          dictionaries: [names, adjectives, animals],
          length: 3,
        };

        const name = uniqueNamesGenerator(nameConfig);

        //Gera DNA para o NFT
        const dna = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

        //Envia a requisição
        props.contract.methods
          .createBadborn(props.address, name, dna)
          .send({
            from: props.address,
          })
          .then(function (receipt) {
            props.checkNFT(
              props.chainParams,
              props.address,
              props.contract,
              props.setStates
            );
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }

  //Handler para ações do botão
  function buttonAction() {
    switch (buttonActionId) {
      case 0:
        mintNft();
        break;

      default:
        break;
    }
  }

  //Atualiza texto e ação do botão sempre que o endereço da conta mudar
  useEffect(() => {
    if (
      window.ethereum &&
      ethereum.isMetaMask &&
      ethereum.selectedAddress == null
    ) {
      setResult("Você precisa estar conectado!");
      setButtonActionId(1);
    } else {
      setResult("");
      setButtonActionId(0);
    }
  }, [props.address]);

  //Montagem do componente
  return (
    <>
      <div>
        <button onClick={() => buttonAction()}>Mint</button>
      </div>
      <div>
        <span>{result}</span>
      </div>
    </>
  );
}
