// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOValidatorGeoLocation
 * @dev Precompiled system contract for DePIN proof-of-physical-location, spatial oracle verification,
 * and GeoLibre GIS validator node mapping on PISO Chain.
 */
contract PISOValidatorGeoLocation {
    address public owner;

    struct GeoNode {
        address validator;
        int32 latitude;    // Fixed point 6 decimal places (e.g. 14599512 = 14.599512 N)
        int32 longitude;   // Fixed point 6 decimal places (e.g. 12098422 = 120.98422 E)
        string countryCode; // ISO 3166-1 alpha-2 (e.g. "PH", "SG", "JP")
        string city;
        uint256 registeredAt;
        bool isActive;
    }

    mapping(address => GeoNode) public validatorGeoNodes;
    address[] public registeredValidators;

    event GeoNodeRegistered(address indexed validator, int32 latitude, int32 longitude, string countryCode, string city);
    event GeoNodeUpdated(address indexed validator, int32 latitude, int32 longitude, bool isActive);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOValidatorGeoLocation: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        
        // Register Default Genesis Validator Geo-Locations (Manila, Singapore, Tokyo)
        _registerInternal(0xB5A772355e12CA975C175C9a7CFBD48BBEE482D8, 14599512, 120984212, "PH", "Manila");
        _registerInternal(0xC918073809dfAF68228c91307B22A6a02Bc9d3f7, 1352083, 103819836, "SG", "Singapore");
        _registerInternal(0xD72910484501fDFB9347d4a5847ec6339dC53B21, 35676192, 139650311, "JP", "Tokyo");
    }

    function _registerInternal(address _val, int32 _lat, int32 _lng, string memory _country, string memory _city) internal {
        if (validatorGeoNodes[_val].registeredAt == 0) {
            registeredValidators.push(_val);
        }
        validatorGeoNodes[_val] = GeoNode({
            validator: _val,
            latitude: _lat,
            longitude: _lng,
            countryCode: _country,
            city: _city,
            registeredAt: block.timestamp,
            isActive: true
        });
        emit GeoNodeRegistered(_val, _lat, _lng, _country, _city);
    }

    function registerGeoNode(int32 _lat, int32 _lng, string calldata _country, string calldata _city) external returns (bool) {
        _registerInternal(msg.sender, _lat, _lng, _country, _city);
        return true;
    }

    function getValidatorGeo(address _validator) external view returns (int32 lat, int32 lng, string memory country, string memory city, bool active) {
        GeoNode memory node = validatorGeoNodes[_validator];
        return (node.latitude, node.longitude, node.countryCode, node.city, node.isActive);
    }

    function getAllValidatorsCount() external view returns (uint256) {
        return registeredValidators.length;
    }
}
