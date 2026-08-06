// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOProofOfWork
 * @dev On-chain Proof of Work (PoW) verification & task reward distribution smart contract for PISO Chain.
 * Allows validators, autonomous AI workers, and miners to prove computational work via cryptographic nonces.
 */
contract PISOProofOfWork {
    address public owner;
    uint256 public nextChallengeId;
    uint256 public totalValidProofs;
    uint256 public totalRewardsDistributed;

    struct Challenge {
        uint256 id;
        bytes32 challengeHash;
        uint256 targetDifficulty; // Number of leading zero bits required
        uint256 rewardAmount;     // PISO wei reward for valid proof
        bool active;
        uint256 totalSubmissions;
        address solver;
        uint256 solvedAt;
    }

    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => mapping(address => bool)) public hasSubmitted;

    event ChallengeCreated(
        uint256 indexed challengeId,
        bytes32 indexed challengeHash,
        uint256 targetDifficulty,
        uint256 rewardAmount
    );

    event WorkSubmitted(
        uint256 indexed challengeId,
        address indexed miner,
        uint256 nonce,
        bytes32 proofHash,
        uint256 rewardPaid
    );

    event ChallengeClosed(uint256 indexed challengeId, address indexed finalSolver);
    event DifficultyAdjusted(uint256 indexed challengeId, uint256 oldDifficulty, uint256 newDifficulty);

    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOProofOfWork: Caller is not owner");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "PISOProofOfWork: ReentrancyGuard reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor() {
        owner = msg.sender;
        nextChallengeId = 1;
        _status = _NOT_ENTERED;
    }

    receive() external payable {}

    /**
     * @dev Creates a new PoW mining challenge on-chain with optional reward escrow.
     */
    function createChallenge(bytes32 _challengeHash, uint256 _targetDifficulty) external payable returns (uint256) {
        require(_targetDifficulty > 0 && _targetDifficulty < 256, "PISOProofOfWork: Invalid difficulty bits");

        uint256 challengeId = nextChallengeId++;
        challenges[challengeId] = Challenge({
            id: challengeId,
            challengeHash: _challengeHash,
            targetDifficulty: _targetDifficulty,
            rewardAmount: msg.value,
            active: true,
            totalSubmissions: 0,
            solver: address(0),
            solvedAt: 0
        });

        emit ChallengeCreated(challengeId, _challengeHash, _targetDifficulty, msg.value);
        return challengeId;
    }

    /**
     * @dev Verifies pure Proof of Work nonce off-chain or on-chain without state mutation.
     */
    function verifyProof(
        bytes32 _challengeHash,
        address _miner,
        uint256 _nonce,
        uint256 _targetDifficulty
    ) public pure returns (bool valid, bytes32 proofHash, uint256 hashValue, uint256 targetValue) {
        proofHash = keccak256(abi.encodePacked(_challengeHash, _miner, _nonce));
        hashValue = uint256(proofHash);
        
        if (_targetDifficulty == 0) {
            targetValue = type(uint256).max;
        } else if (_targetDifficulty >= 256) {
            targetValue = 0;
        } else {
            targetValue = type(uint256).max >> _targetDifficulty;
        }

        valid = (hashValue <= targetValue);
    }

    /**
     * @dev Submits a solved nonce for an active challenge and claims reward.
     */
    function submitWork(uint256 _challengeId, uint256 _nonce) external nonReentrant returns (bool) {
        Challenge storage ch = challenges[_challengeId];
        require(ch.active, "PISOProofOfWork: Challenge is inactive or solved");
        require(!hasSubmitted[_challengeId][msg.sender], "PISOProofOfWork: Address already submitted solution");

        (bool valid, bytes32 proofHash, , ) = verifyProof(
            ch.challengeHash,
            msg.sender,
            _nonce,
            ch.targetDifficulty
        );

        require(valid, "PISOProofOfWork: Proof of work hash does not satisfy target difficulty");

        hasSubmitted[_challengeId][msg.sender] = true;
        ch.totalSubmissions += 1;
        ch.active = false;
        ch.solver = msg.sender;
        ch.solvedAt = block.timestamp;

        totalValidProofs += 1;

        uint256 reward = ch.rewardAmount;
        if (reward > 0) {
            totalRewardsDistributed += reward;
            (bool sent, ) = payable(msg.sender).call{value: reward}("");
            require(sent, "PISOProofOfWork: Failed to transfer reward PISO");
        }

        emit WorkSubmitted(_challengeId, msg.sender, _nonce, proofHash, reward);
        emit ChallengeClosed(_challengeId, msg.sender);

        return true;
    }

    /**
     * @dev Allows owner to adjust difficulty for open challenges.
     */
    function adjustDifficulty(uint256 _challengeId, uint256 _newDifficulty) external onlyOwner {
        require(_newDifficulty > 0 && _newDifficulty < 256, "PISOProofOfWork: Invalid difficulty");
        Challenge storage ch = challenges[_challengeId];
        require(ch.active, "PISOProofOfWork: Challenge is not active");

        uint256 oldDiff = ch.targetDifficulty;
        ch.targetDifficulty = _newDifficulty;

        emit DifficultyAdjusted(_challengeId, oldDiff, _newDifficulty);
    }

    /**
     * @dev Fetches full details for a challenge.
     */
    function getChallenge(uint256 _challengeId) external view returns (Challenge memory) {
        return challenges[_challengeId];
    }
}
