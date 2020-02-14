import ipfsHttpClient from 'ipfs-http-client';
import {Buffer} from "buffer";
export default class InfuraIpfsService {
  ipfs = ipfsHttpClient('ipfs.infura.io', '5001', {protocol: 'https'});

  async pushBufferToIpfs(buffer: any, tryingToUpload: string): Promise<string> {
    try {
      const results = await this.ipfs.add(buffer, {pin: true});

      if (results && Array.isArray(results) && results.length > 0) {
        const result = results[0];
        const hash = result && result.hash ? result.hash : 'unsuccessful';

        if (hash === 'unsuccessful') {
          alert(`Failed to upload ${tryingToUpload} to IPFS due to: No hash returned`);
        }

        return hash;
      }
    } catch (e) {
      alert(`Failed to upload ${tryingToUpload} to IPFS due to: ${e}`);
    }

    return 'unsuccessful';
  }

  async uploadImageToIpfs(fileBuffer: any): Promise<string> {
    return this.pushBufferToIpfs(fileBuffer, 'image');
  }

  async pushJsonToIpfs(ipfsPayload: any): Promise<string> {
    const buffer = Buffer.from(JSON.stringify(ipfsPayload));
    return this.pushBufferToIpfs(buffer, 'token data');
  }
}
