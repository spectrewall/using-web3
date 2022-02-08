import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import ContractBox from "../components/Contracts/ContractBox";

export default function Home() {
  const NODE_URL = "https://rpc-mumbai.maticvigil.com/";

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
        <ContractBox />
      </main>

      <footer className={styles.footer}>
        <a href="#">Powered by SpectrYaw</a>
      </footer>
    </div>
  );
}
