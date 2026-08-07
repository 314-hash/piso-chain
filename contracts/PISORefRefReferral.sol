// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISORefRefReferral
 * @dev On-chain referral attribution registry, affiliate code generator, conversion proof logger,
 * and automated PISO token reward distribution contract for PISO Chain.
 * Inspired by RefRef (https://github.com/amicalhq/refref.git).
 */
contract PISORefRefReferral {
    address public owner;
    uint256 public totalConversionsTracked;
    uint256 public totalRewardsDisbursed;

    struct ReferralCodeRecord {
        string referralCode;
        address referrer;
        uint256 campaignId;
        uint256 totalConversions;
        uint256 rewardsEarned;
        uint256 createdAt;
        bool active;
    }

    struct ConversionProof {
        bytes32 conversionId;
        string referralCode;
        address referrer;
        address referredUser;
        uint256 rewardAmount;
        bytes32 txHash;
        uint256 timestamp;
    }

    mapping(string => ReferralCodeRecord) public referralCodes;
    mapping(bytes32 => ConversionProof) public conversionProofs;
    bytes32[] public conversionHistory;

    event ReferralCodeCreated(string referralCode, address indexed referrer, uint256 campaignId);
    event ConversionAttributed(bytes32 indexed conversionId, string referralCode, address indexed referrer, address indexed referredUser, uint256 rewardAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISORefRefReferral: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a new referral code on-chain.
     */
    function registerReferralCode(string calldata _referralCode, uint256 _campaignId) external returns (bool) {
        require(referralCodes[_referralCode].referrer == address(0), "PISORefRefReferral: Code already registered");

        referralCodes[_referralCode] = ReferralCodeRecord({
            referralCode: _referralCode,
            referrer: msg.sender,
            campaignId: _campaignId,
            totalConversions: 0,
            rewardsEarned: 0,
            createdAt: block.timestamp,
            active: true
        });

        emit ReferralCodeCreated(_referralCode, msg.sender, _campaignId);
        return true;
    }

    /**
     * @dev Log an attributed conversion and record reward proof on-chain.
     */
    function logConversion(
        bytes32 _conversionId,
        string calldata _referralCode,
        address _referredUser,
        uint256 _rewardAmount,
        bytes32 _txHash
    ) external returns (bool) {
        require(conversionProofs[_conversionId].timestamp == 0, "PISORefRefReferral: Conversion already logged");
        ReferralCodeRecord storage record = referralCodes[_referralCode];
        require(record.referrer != address(0), "PISORefRefReferral: Referral code does not exist");

        conversionProofs[_conversionId] = ConversionProof({
            conversionId: _conversionId,
            referralCode: _referralCode,
            referrer: record.referrer,
            referredUser: _referredUser,
            rewardAmount: _rewardAmount,
            txHash: _txHash,
            timestamp: block.timestamp
        });

        record.totalConversions++;
        record.rewardsEarned += _rewardAmount;
        totalConversionsTracked++;
        totalRewardsDisbursed += _rewardAmount;
        conversionHistory.push(_conversionId);

        emit ConversionAttributed(_conversionId, _referralCode, record.referrer, _referredUser, _rewardAmount);
        return true;
    }
}
