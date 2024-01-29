import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {DOUClient} from "dou-react";
import {Chain} from "../constants/chain";

const client = new DOUClient("1", {
    ...Chain,
    rpcUrl: `${globalThis?.location?.origin}/rpc`,
    backendUrl: `${globalThis?.location?.origin}`,

    signUrl: `${globalThis?.location?.origin}/sign`,
    callUrl: `${globalThis?.location?.origin}/call`,
})

const redirect = () => {
    // 获取用户的内部地址address
    const [address, setAddress] = useState<string>("");
    // 获取交易hash
    const [txHash, setTxHash] = useState<string>("");
    // 获取extra
    const [extra, setExtra] = useState<string>("");
    // 获取签名signature
    const [signature, setSignature] = useState<string>("");
    // 获取message
    const [message, setMessage] = useState<string>("");
    // 获取isLogin
    const [isLogin, setIsLogin] = useState<string>("");
    // 获取isLogin
    const [userDetail, setUserDetail] = useState<string>("");

    const router = useRouter()

    useEffect(() => {
        const params = new URLSearchParams(router.asPath.split('?')[1]);
        setAddress(params.get('address') || null);
        setTxHash(params.get('txHash') || null);
        setExtra(params.get('extra') || null);
        setSignature(params.get('signature') || null);
        setMessage(atob(params.get('message') || ""));
        setIsLogin(params.get('isLogin') || null);
    }, []);

    const fetchUserDetail = async () => {
        try {
            const {userInfo} = await client.getUserInfo(address, message, signature)
            setUserDetail(JSON.stringify(userInfo, null, 2))
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => { isLogin && fetchUserDetail().then() }, [isLogin]);

    return (
        <div>
            <h1>redirect</h1>
            {address && <p>address: {address}</p>}
            {txHash && <p>txHash: {txHash}</p>}
            {extra && <p>extra: {extra}</p>}
            {signature && <p>signature: {signature}</p>}
            {message && <p>message: {message}</p>}
            {
                isLogin && <>
                    <hr/>
                    <p>isLogin: {isLogin}</p>
                    <p>userDetail: {userDetail}</p>
                </>
            }
        </div>
    )
}

export default redirect
