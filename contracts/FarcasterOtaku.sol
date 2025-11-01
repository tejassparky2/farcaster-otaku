// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FarcasterOtaku is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant MINT_PRICE = 0.0007 ether;
    uint256 public totalMinted;
    
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => uint256) public fidToTokenId; // FID to latest token ID
    mapping(uint256 => address) public fidToAddress; // FID to minting address
    
    event OtakuMinted(
        uint256 indexed tokenId,
        uint256 indexed fid,
        address indexed minter,
        string ipfsHash
    );
    
    constructor() ERC721("Farcaster Otaku", "OTAKU") {}
    
    function mint(
        address to,
        string memory ipfsHash,
        uint256 fid,
        string memory pfpUrl
    ) external payable returns (uint256) {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        totalMinted++;
        
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = ipfsHash;
        
        fidToTokenId[fid] = tokenId;
        fidToAddress[fid] = to;
        
        emit OtakuMinted(tokenId, fid, to, ipfsHash);
        
        return tokenId;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked("ipfs://", _tokenURIs[tokenId]));
    }
    
    function getOtakuByFid(uint256 fid) external view returns (uint256) {
        return fidToTokenId[fid];
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
