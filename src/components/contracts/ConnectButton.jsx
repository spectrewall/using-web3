/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

export default function ConnectButton(props) {
  const [buttonText, setButtonText] = useState([]);
  const [buttonActionId, setButtonActionId] = useState([]);

  function connectMetamask() {
    ethereum
      //requisita acesso a conta do usuário
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        //seta a conta como padrão
        props.setStates(2, accounts[0]);

        //seta a Chain
        ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: props.chainParams.chainId }],
          })
          .catch((err) => {
            if (err.code === 4902) {
              //Adiciona a nova rede a metamask
              ethereum
                .request({
                  method: "wallet_addEthereumChain",
                  params: props.chainParams,
                })
                .catch(() => {
                  window.location.reload();
                });
            } else {
              window.location.reload();
            }
          });
      })
      .catch((err) => {
        if (err.code != 4001) {
          window.location.reload();
        }
      });
  }

  //Handler para ações do botão
  function buttonAction() {
    switch (buttonActionId) {
      case 0:
        connectMetamask();
        break;

      default:
        break;
    }
  }

  //Atualiza texto do botão ao carregar e sempre que a conta mudar
  useEffect(() => {
    if (window.ethereum && ethereum.isMetaMask) {
      if (ethereum.selectedAddress == null) {
        setButtonActionId(0);
        setButtonText("Connect Metamask");
      } else {
        setButtonActionId(1);
        setButtonText("Connected: " + props.address);
      }
    } else {
      setButtonText("Install MetaMask");
      setButtonActionId(2);
    }
  }, [props.address]);

  //Montagem do componente
  return <button onClick={() => buttonAction()}>{buttonText}</button>;
}
