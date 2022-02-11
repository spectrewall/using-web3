//Verifica os NFTs do usuário
export function checkNFT(chainParams, address, contract, setStates) {
  ethereum
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainParams[0].chainId }],
    })
    .catch((err) => {
      if (err.code === 4902) {
        //Adiciona a nova rede a metamask
        ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: chainParams,
          })
          .catch((err) => {
            window.location.reload();
          });
      } else {
        window.location.reload();
      }
    })
    .then(() => {
      //Envia a requisição
      contract.methods
        .getBadbornsByOwner(address)
        .call({
          from: address,
        })
        .then(function (receipt) {
          setStates(4, receipt);
        })
        .catch((err) => {
          console.log(err);
        });
    });
}
