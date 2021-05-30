//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract Voting {
    struct Election {
        uint256 registrationEndPeriod;
        uint256 votingEndPeriod;
        address[] candidates;
    }

    struct CandidateData {
        uint256 voteCount;
        uint256 electionId;
        string name;
    }

    mapping(address => CandidateData) candidateToCandidateDataMap;
    mapping(address => bool) voters;

    Election[] public elections;
    uint256 numElections;
    bool public locked;

    event StartElection(
        uint256 indexed _index,
        uint256 _registrationEndPeriod,
        uint256 _votingEndPeriod
    );

    event VoteForCandidate(
      address indexed _candidateAddress,
      uint256 indexed _voteCount,
      address indexed _voter
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
    ) public {
        require(
            _registrationEndPeriod >= block.timestamp &&
                _votingEndPeriod >= _registrationEndPeriod
        );
        address[] memory candidates;
        elections.push(
            Election(_registrationEndPeriod, _votingEndPeriod, candidates)
        );
        emit StartElection(
            elections.length,
            _registrationEndPeriod,
            _votingEndPeriod
        );
    }

    function registerCandidate(uint256 _electionId, string memory _name)
        public
    {
        require(
            getKeccak(_name) != getKeccak(""),
            "Please register with a name."
        );
        require(
            block.timestamp < elections[_electionId].registrationEndPeriod,
            "The registration period has ended."
        );
        require(
            getKeccak(candidateToCandidateDataMap[msg.sender].name) ==
                getKeccak(""),
            "You have already registered for an election."
        );
        elections[_electionId].candidates.push(msg.sender);
        candidateToCandidateDataMap[msg.sender] = CandidateData(
            0,
            _electionId,
            _name
        );
    }

    function voteForCandidate(uint256 _electionId, address _candidateId)
        public
        noReentrancy
    {
        require(!voters[msg.sender], "You have already voted for a candidate.");
        require(
            getKeccak(candidateToCandidateDataMap[_candidateId].name) !=
                getKeccak(""),
            "This address does not belong to a candidate."
        );
        require(
            block.timestamp > elections[_electionId].registrationEndPeriod &&
                block.timestamp < elections[_electionId].votingEndPeriod,
            "Voting is not allowed now."
        );
        candidateToCandidateDataMap[_candidateId].voteCount++;
        voters[msg.sender] = true;
    }

    function getCandidateData(address _candidateId)
        public
        view
        returns (uint256, string memory)
    {
        CandidateData storage data = candidateToCandidateDataMap[_candidateId];
        return (data.voteCount, data.name);
    }

    function getElectionsCount() public view returns (uint256) {
        return elections.length;
    }

    function getResults(uint256 _electionId)
        public
        view
        returns (address[] memory, uint256)
    {
        Election storage election = elections[_electionId];
        return (election.candidates, election.votingEndPeriod);
    }

    function getKeccak(string memory _string) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_string));
    }
}
