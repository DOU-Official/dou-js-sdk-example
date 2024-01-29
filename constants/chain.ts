
import {Chains, ChainType} from "dou-react";

export const Type: ChainType = "testnet"
export const Chain = Chains[Type]!

export function blockUrl(block: string) {
  return `${Chain.explorer}/block/${block}`
}
export function txUrl(tx: string) {
  return `${Chain.explorer}/tx/${tx}`
}
export function addressUrl(address: string) {
  return `${Chain.explorer}/address/${address}`
}
