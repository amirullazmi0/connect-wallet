
import './App.css';
import { useSyncProviders } from './useSyncProviders';

const App = () => {
	const providers = useSyncProviders();

	const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
		try {
			const accounts = (await providerWithInfo.provider.request({
				method: 'eth_requestAccounts',
			})) as string[];
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='App'>
			<h2>Wallets Detected:</h2>
			<div className='providers'>
				{providers.length > 0 ? (
					providers?.map((provider: EIP6963ProviderDetail) => (
						<button
							key={provider.info.uuid}
							onClick={() => handleConnect(provider)}>
							<img
								src={provider.info.icon}
								alt={provider.info.name}
							/>
							<div>{provider.info.name}</div>
						</button>
					))
				) : (
					<div>No Announced Wallet Providers</div>
				)}
			</div>
		</div>
	);
};

export default App;
