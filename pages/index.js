import Head from "next/head"
import Image from "next/image"
import { Inter } from "@next/font/google"
import styles from "@/styles/Home.module.css"
import Header from "../components/Header"
import LotteryEntrance from "@/components/LotteryEntrance"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <div className="py-2 px-5">
            <Head>
                <title>Lottery app</title>
                <meta name="description" content="Lottery..." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}
