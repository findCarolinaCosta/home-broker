
import MyWallet from "../components/MyWallet";

async function HomePage({params}: { params: {wallet_id: string} }) {
    return (
        <div>
            <h1>Meus Investimentos</h1>
            <MyWallet wallet_id={params.wallet_id} />
        </div>
      );
}

export default HomePage;