import { ethers } from "ethers";

export function getProvider() {
    if (window.ethereum) return new ethers.BrowserProvider(window.ethereum);
    return null;
}

// helper to format address short
export function shortAddr(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
}
