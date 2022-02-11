/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

export default function CheckNFTs(props) {
  //Variavel de estado para guardar os dados de todos os NFT's do usuário
  //const [usersNfts, setUsersNfts] = useState([]);

  useEffect(() => {
    if (props.contract.methods)
      props.checkNFT(
        props.chainParams,
        props.address,
        props.contract,
        props.setStates
      );
  }, [props.address, props.contract]);

  //Montagem do componente
  if (props.nfts.length) {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME</th>
              <th>DNA</th>
            </tr>
          </thead>
          <tbody>
            {props.nfts.map((nft, i) => {
              return (
                <tr key={i}>
                  <td>{nft["id"]}</td>
                  <td>{nft["name"]}</td>
                  <td>{nft["dna"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  } else {
    return <span>Nenhum NFT encontrado</span>;
  }
}
