import { useState } from 'react';
import { useSyncProviders } from './useSyncProviders';

const App = () => {
	const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>();
	const [userAccount, setUserAccount] = useState<string>('');
	const providers = useSyncProviders();

	const [errorMessage, setErrorMessage] = useState('');
	const clearError = () => setErrorMessage('');
	const setError = (error: string) => setErrorMessage(error);
	const isError = !!errorMessage;

	// Display a readable user address.
	const formatAddress = (addr: string) => {
		const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2);
		return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(39)}`;
	};

	const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
		try {
			const accounts = (await providerWithInfo.provider.request({
				method: 'eth_requestAccounts',
			})) as string[];

			setSelectedWallet(providerWithInfo);
			setUserAccount(accounts?.[0]);
		} catch (error) {
			console.error(error);
			const mmError: MMError = error as MMError;
			setError(`Code: ${mmError.code} \nError Message: ${mmError.message}`);
		}
	};

	return (
		<div className='flex flex-col justify-center items-center min-h-screen p-5 gap-5 bg-zinc-200'>
			<div className='bg-purple-500 p-3 text-white text-4xl font-bold rounded-xl shadow-lg'>Wallets Detected</div>
			<div className='grid grid-cols-2 gap-5'>
				<div className='flex flex-col justify-center bg-white p-5 rounded-xl shadow-xl lg:md:min-w-[300px] gap-5'>
					{providers.length > 0 ? (
						providers?.map((provider: EIP6963ProviderDetail) => (
							<button
								key={provider.info.uuid}
								onClick={() => handleConnect(provider)}
								className='flex flex-col w-full justify-center items-center bg-zinc-100 p-4 rounded-xl hover:scale-105 duration-200 active:scale-100'>
								<img
									src={provider.info.icon}
									alt={provider.info.name}
									className='h-10'
								/>
								<div>{provider.info.name}</div>
							</button>
						))
					) : (
						<div>No Announced Wallet Providers</div>
					)}
				</div>
				<div className='flex flex-col bg-white p-5 rounded-xl shadow-xl lg:md:min-w-[300px] gap-5'>
					<h2>{userAccount ? '' : 'No'} Wallet Selected</h2>
					{userAccount && (
						<div className='flex flex-col w-full justify-center items-center bg-zinc-100 p-4 rounded-xl '>
							<img
								src={selectedWallet?.info.icon}
								alt={selectedWallet?.info.name}
								className='h-10'
							/>
							<div>{selectedWallet?.info.name}</div>
							<div>({formatAddress(userAccount)})</div>
						</div>
					)}
					<div
						className='mmError'
						style={isError ? { backgroundColor: 'brown' } : {}}>
						{isError && (
							<div onClick={clearError}>
								<strong>Error:</strong> {errorMessage}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
