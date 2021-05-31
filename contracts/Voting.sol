//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract Voting {
    struct Candidate {
        address candidateAddress;
        uint256 voteCount;
        string name;
    }
    struct Voter {
        bool voted;
        uint256 candidateIndex;
    }

    uint256 public electionId;
    uint256 public registrationEndPeriod;
    uint256 public votingEndPeriod;
    bool public locked;

    Candidate[] public candidates;
    mapping(address => bool) public registeredCandidates;
    mapping(address => Voter) public voters;

    event StartElection(
        uint256 indexed _electionId,
        uint256 _registrationEndPeriod,
        uint256 _votingEndPeriod
    );

    event RegisterCandidate(string _name);

    event VoteForCandidate(
        uint256 indexed _candidateAddress,
        uint256 _voteCount
    );

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }

    function startElection(
        uint256 _registrationEndPeriod,
        uint256 _votingEndPeriod
    ) external {
        require(
            _registrationEndPeriod >= block.timestamp &&
                _votingEndPeriod >= _registrationEndPeriod,
            "Registration end period must be > voting end period > registration end period."
        );
        bool hasElectionEnded =
            (registrationEndPeriod == 0 && votingEndPeriod == 0) ||
                block.timestamp > votingEndPeriod;
        require(
            hasElectionEnded,
            "There is an active election currently, please wait until it is over."
        );
        if (registrationEndPeriod != 0 || votingEndPeriod != 0) {
            electionId++;
        }
        registrationEndPeriod = _registrationEndPeriod;
        votingEndPeriod = _votingEndPeriod;

        emit StartElection(electionId, _registrationEndPeriod, _votingEndPeriod);
    }

    function registerCandidate(string memory _name) external {
        require(
            registrationEndPeriod != 0,
            "There are no elections currently."
        );
        require(
            getKeccak(_name) != getKeccak(""),
            "Please register with a name."
        );
        require(
            block.timestamp < registrationEndPeriod,
            "The registration period has ended."
        );
        require(
            registeredCandidates[msg.sender] == false,
            "You have already registered for an election."
        );
        registeredCandidates[msg.sender] = true;
        candidates.push(Candidate(msg.sender, 0, _name));

        emit RegisterCandidate(_name);
    }

    function voteForCandidate(uint256 _candidateId) external noReentrancy {
        require(
            !voters[msg.sender].voted,
            "You have already voted for a candidate."
        );
        require(candidates.length >= _candidateId + 1, "This candidate doesn't exist.");
        require(
            block.timestamp > registrationEndPeriod &&
                block.timestamp < votingEndPeriod,
            "Voting is not allowed now."
        );
        candidates[_candidateId].voteCount++;
        voters[msg.sender].voted = true;
        voters[msg.sender].candidateIndex = _candidateId;

        emit VoteForCandidate(_candidateId, candidates[_candidateId].voteCount);
    }

    function getLiveResults() public view returns(address[] memory, uint256[] memory) {
        address[] memory addresses = new address[](candidates.length);
        uint256[] memory voteCounts = new uint256[](candidates.length);
        
        for (uint256 i = 0; i < candidates.length; i++) {
            addresses[i] = candidates[i].candidateAddress;
            voteCounts[i] = candidates[i].voteCount;
        }
        return (addresses, voteCounts);
    }

    function getWinnerResults()
        public
        view
        returns (uint256 _winningCandidate, bool isOver)
    {
        uint256 winningCount = 0;
        isOver = block.timestamp > votingEndPeriod;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningCount) {
                winningCount = candidates[i].voteCount;
                _winningCandidate = i;
            }
        }
    }

    function winnerName() external view returns (string memory _name) {
        (uint256 winningCandidate, ) = getWinnerResults();
        return candidates[winningCandidate].name;
    }

    function getKeccak(string memory _string) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_string));
    }
}
