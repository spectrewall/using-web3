/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  names,
  animals,
} from "unique-names-generator";

export default function MintButton(props) {
  const [nftName, setNftName] = useState([]);
  const [result, setResult] = useState([]);
  const [buttonActionId, setButtonActionId] = useState([]);

  //Chama a função de mint
  function mintNft() {
    //Cria nome para o NFT
    const nameConfig = {
      dictionaries: [names, adjectives, animals],
      length: 3,
    };

    setNftName(uniqueNamesGenerator(nameConfig));

    //Gera DNA para o NFT
    let dna = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

    //Gera o ABI com os parametros do método
    let data = props.contract.methods
      .createBadborn(props.address, nftName, dna)
      .encodeABI();

    //Pega o preço do gas na rede mumbai
    fetch("https://gasstation-mumbai.matic.today/v2")
      .then((response) => response.json())
      .then((json) => {
        let gasPrice = json.fast.maxFee.toString();

        let params = [
          {
            nonce: "0x00",
            gas: "2100000",
            gasPrice: gasPrice,
            from: props.address,
            to: props.contractAddress,
            chainId: props.chainParams.chainId,
            data: data,
          },
        ];

        ethereum
          .request({ method: "eth_sendTransaction", params: params })
          .then((hash) => {
            console.log(hash);
          });
      })
      .catch((err) => {
        console.log(err);
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
