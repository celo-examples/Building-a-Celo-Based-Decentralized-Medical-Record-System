
solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MedicalRecord is ERC721, AccessControl {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

    struct Record {
        string name;
        string birthdate;
        string medicalData;
    }

    mapping(uint256 => Record) private _records;

    event RecordCreated(uint256 tokenId, string name, string birthdate);

    constructor() ERC721("MedicalRecord", "MREC") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createRecord(
        address to,
        string memory name,
        string memory birthdate,
        string memory medicalData
    ) public onlyRole(DOCTOR_ROLE) returns (uint256) {
        uint256 tokenId = totalSupply() + 1;
        _safeMint(to, tokenId);
        _records[tokenId] = Record(name, birthdate, medicalData);
        emit RecordCreated(tokenId, name, birthdate);
        return tokenId;
    }

    function viewRecord(uint256 tokenId) public view returns (Record memory) {
        require(_exists(tokenId), "Record does not exist");
        return _records[tokenId];
    }

    function updateRecord(
        uint256 tokenId,
        string memory newMedicalData
    ) public onlyRole(DOCTOR_ROLE) {
        require(_exists(tokenId), "Record does not exist");
        _records[tokenId].medicalData = newMedicalData;
    }

    function grantDoctorRole(address doctor) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DOCTOR_ROLE, doctor);
    }

    function revokeDoctorRole(address doctor) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(DOCTOR_ROLE, doctor);
    }
}
