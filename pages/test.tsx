import {Button, Form, Input, Select} from "antd";
import React, {useEffect} from "react";
import {DOUClient, ResourceType} from "dou-react";
import {AbiItem} from "web3-utils";
import {Chain} from "../constants/chain";

const client = new DOUClient("1", {
    ...Chain,
    rpcUrl: `${globalThis?.location?.origin}/rpc`,
    backendUrl: `${globalThis?.location?.origin}`,

    signUrl: `${globalThis?.location?.origin}/sign`,
    callUrl: `${globalThis?.location?.origin}/call`,
})

const ContractAddress = "0x379fa589FFB79598044f275F0B80A985bb23d6a0"
const ContractABIs = [{
    "inputs": [{
        "internalType": "string[]",
        "name": "initialCandidates",
        "type": "string[]"
    }, {"internalType": "uint256", "name": "endTimestamp", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "voter", "type": "address"}, {
        "indexed": true,
        "internalType": "string",
        "name": "candidate",
        "type": "string"
    }],
    "name": "VoteEvent",
    "type": "event"
}, {
    "inputs": [{"internalType": "string", "name": "newCandidate", "type": "string"}],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "candidateList",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "deadline",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "hasVoted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "queryOwnVote",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "newDeadline", "type": "uint256"}],
    "name": "setDeadline",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "string", "name": "candidate", "type": "string"}],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "string", "name": "", "type": "string"}],
    "name": "voteCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}] as AbiItem[]
const CandidateList = ["A", "B", "C", "D"]

export default function Index() {
    const [signMessage, setSignMessage] = React.useState<string>("")
    const [signRedirectUrl, setSignRedirectUrl] = React.useState<string>(`${globalThis?.location?.origin}/redirect`)
    const [loginRedirectUrl, setLoginRedirectUrl] = React.useState<string>(`${globalThis?.location?.origin}/redirect`)
    const [transactionRedirectUrl, setTransactionRedirectUrl] = React.useState<string>(`${globalThis?.location?.origin}/redirect`)
    const [signExtra, setSignExtra] = React.useState<string>("")
    const [loginExtra, setLoginExtra] = React.useState<string>("")
    const [transactionExtra, setTransactionExtra] = React.useState<string>("")
    const [expSeconds, setExpSeconds] = React.useState<number>(60 * 60 * 24)
    const [contract, setContract] = React.useState<string>("")
    const [callData, setCallData] = React.useState<string>("")
    const [resources, setResources] = React.useState<ResourceType[]>([ResourceType.UserAddresses])

    const [voteInfo, setVoteInfo] = React.useState<{
        [K: string]: number
    }>()
    const [voteFor, setVoteFor] = React.useState<string>("")

    const fetchVoteInfo = async () => {
        const web3 = client.web3
        const contract = new web3.eth.Contract(ContractABIs, ContractAddress)

        let voteInfo = {}
        for (const candidate of CandidateList) {
            // @ts-ignore
            const count = await contract.methods.voteCount(candidate).call()

            setVoteInfo(voteInfo = {...voteInfo, [candidate]: count})
        }
    }
    useEffect(() => {
        fetchVoteInfo().then()
    }, [])

    // 提供ResourceType的下拉框,展示所有的资源类型
    const resourceType = [
        {label: "UserAddresses", value: ResourceType.UserAddresses},
        {label: "UserEmail", value: ResourceType.UserEmail},
        {label: "UserPhone", value: ResourceType.UserPhone},
        {label: "UserIdentity", value: ResourceType.UserIdentity},
        {label: "UserRegion", value: ResourceType.UserRegion},
    ]

    // 选择资源类型
    const handleChange = (value: string | string[]) => {
        console.log(`selected ${value}`);
        setResources(value as ResourceType[])
    };

    const doSign = (metamask?) => {
        metamask ? client.setProvider(window["ethereum"]) : client.resetProvider()
        client.sign(signMessage, signRedirectUrl, signExtra).then(
            res => res && alert(JSON.stringify(res))
        )
    }
    const doLogin = (metamask?) => {
        metamask ? client.setProvider(window["ethereum"]) : client.resetProvider()
        client.login(resources, expSeconds, loginRedirectUrl, loginExtra).then(
            res => res && alert(JSON.stringify(res))
        )
    }
    const doTransaction = (metamask?) => {
        metamask ? client.setProvider(window["ethereum"]) : client.resetProvider()
        client.callRawTransaction(contract, callData, transactionRedirectUrl, transactionExtra).then(
            res => res && alert(JSON.stringify(res))
        )
    }
    const doVote = (metamask?) => {
        metamask ? client.setProvider(window["ethereum"]) : client.resetProvider()
        client.callTransaction(ContractAddress, ContractABIs, "vote", [voteFor], transactionRedirectUrl, transactionExtra).then(
            res => res && alert(JSON.stringify(res))
        )
    }

    return (
        <div style={{display: "flex", flexDirection: "column", margin: "0 100px"}}>
            <div style={{width: "600px"}}>
                <h1>签名</h1>
                <Form
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    layout="horizontal"
                    initialValues={{size: "default"}}
                >
                    <Form.Item label="message">
                        <Input placeholder="message" value={signMessage}
                               onChange={e => setSignMessage(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="redirectUrl">
                        <Input placeholder="redirectUrl" value={signRedirectUrl}
                               onChange={e => setSignRedirectUrl(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="extra">
                        <Input placeholder="extra" value={signExtra} onChange={e => setSignExtra(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="action">
                        <Button onClick={() => doSign()}>DOU 签名</Button>
                        <Button onClick={() => doSign(true)}>Metamask 签名</Button>
                    </Form.Item>
                </Form>
            </div>
            <div style={{width: "600px"}}>
                <h1>登陆</h1>
                <Form
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    layout="horizontal"
                    initialValues={{size: "default"}}
                >
                    <Form.Item label="resources">
                        <Select
                            mode="multiple"
                            allowClear
                            style={{width: "100%"}}
                            placeholder="Please select"
                            onChange={handleChange}
                        >
                            {resourceType.map((item, index) => {
                                return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="expSeconds">
                        <Input placeholder="expSeconds" value={expSeconds}
                               onChange={e => setExpSeconds(parseInt(e.target.value))}/>
                    </Form.Item>
                    <Form.Item label="redirectUrl">
                        <Input placeholder="redirectUrl" value={loginRedirectUrl}
                               onChange={e => setLoginRedirectUrl(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="extra">
                        <Input placeholder="extra" value={loginExtra} onChange={e => setLoginExtra(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="action">
                        <Button onClick={() => doLogin()}>DOU 登陆</Button>
                        <Button onClick={() => doLogin(true)}>Metamask 登陆</Button>
                    </Form.Item>
                </Form>
            </div>
            <div style={{width: "600px"}}>
                <h1>交易</h1>
                <Form
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    layout="horizontal"
                    initialValues={{size: "default"}}
                >
                    <Form.Item label="contract">
                        <Input placeholder="contract" value={contract} onChange={e => setContract(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="callData">
                        <Input placeholder="callData" value={callData} onChange={e => setCallData(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="redirectUrl">
                        <Input placeholder="redirectUrl" value={transactionRedirectUrl}
                               onChange={e => setTransactionRedirectUrl(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="extra">
                        <Input placeholder="extra" value={transactionExtra}
                               onChange={e => setTransactionExtra(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="action">
                        <Button onClick={() => doTransaction()}>DOU 交易</Button>
                        <Button onClick={() => doTransaction(true)}>Metamask 交易</Button>
                    </Form.Item>
                </Form>
            </div>
            <div style={{width: "600px"}}>
                <h1>投票Demo</h1>
                <Form
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    layout="horizontal"
                    initialValues={{size: "default"}}
                >
                    <Form.Item label="voteFor">
                        <Select
                            allowClear
                            style={{width: "100%"}}
                            placeholder="Please select what you want to vote for"
                            onChange={v => setVoteFor(v)}
                        >
                            {CandidateList.map((item, index) => {
                                return <Select.Option key={index} value={item}>{item}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="redirectUrl">
                        <Input placeholder="redirectUrl" value={transactionRedirectUrl}
                               onChange={e => setTransactionRedirectUrl(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="extra">
                        <Input placeholder="extra" value={transactionExtra}
                               onChange={e => setTransactionExtra(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="action">
                        <Button onClick={() => doVote()}>DOU 投票</Button>
                        <Button onClick={() => doVote(true)}>Metamask 投票</Button>
                    </Form.Item>
                </Form>
                <h3>投票结果</h3>
                <div style={{display: "flex", flexDirection: "row"}}>
                    {CandidateList.map((item, index) =>
                        <div key={index} style={{marginRight: "20px"}}>{item}: {voteInfo?.[item]}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
