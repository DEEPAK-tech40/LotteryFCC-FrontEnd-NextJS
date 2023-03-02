import { abi, contractAddress } from "@/constants"
import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import "@web3uikit/icons"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, c } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const LotteryAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterLottery,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: LotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: LotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: LotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: LotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUi() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        console.log(entranceFee)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (txn) => {
        await txn.wait(1)
        handleNotification(txn)
        updateUi()
    }

    const handleNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Txn Notification",
            position: "topR",
        })
    }

    return (
        <div className="px-4 py-4">
            <h2 className="text-lg font-blog">Welcome to the Lottery!</h2>
            {LotteryAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto m-3"
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Lottery</div>
                        )}
                    </button>
                    <div> Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div> No.of Players: {numPlayers}</div>
                    <div> RecentWinner: {recentWinner}</div>
                </div>
            ) : (
                <div>No lottery found!!!</div>
            )}
        </div>
    )
}
