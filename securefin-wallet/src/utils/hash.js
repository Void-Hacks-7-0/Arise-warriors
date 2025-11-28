import { ethers } from "ethers";

export function computeDemoHash(obj) {
    const json = JSON.stringify(obj);
    const bytes = ethers.toUtf8Bytes(json);
    const hash = ethers.keccak256(bytes); // 0x...
    return hash;
}
