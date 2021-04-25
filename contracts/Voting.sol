//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract Voting {

  struct Election {
    uint registrationEndPeriod;
    uint votingEndPeriod;
    address[] candidates;
  }

  struct CandidateData {
    uint voteCount;
    uint electionId;
    string name;
  }

  mapping (address => CandidateData) candidateToCandidateDataMap;
  mapping (address => bool) voters;

  Election[] public elections;
  uint numElections;
  bool public locked;

  modifier noReentrancy() {
    require(!locked, "No reentrancy");

    locked = true;
    _;
    locked = false;
  }

  function getKeccak(string memory _string) private pure returns(bytes32) {
    return keccak256(abi.encodePacked(_string));
  }

  function startElection(uint _registrationEndPeriod, uint _votingEndPeriod) public {
    require(_registrationEndPeriod >= block.timestamp && _votingEndPeriod >= _registrationEndPeriod);
    address[] memory candidates;
    elections.push(Election(_registrationEndPeriod, _votingEndPeriod, candidates));
  }

  function registerCandidate(uint _electionId, string memory _name) public {
    require(getKeccak(_name) != getKeccak(""), "Please register with a name.");
    require(block.timestamp < elections[_electionId].registrationEndPeriod, "The registration period has ended.");
    require(getKeccak(candidateToCandidateDataMap[msg.sender].name) == getKeccak(""), "You have already registered for an election.");
    elections[_electionId].candidates.push(msg.sender);
    candidateToCandidateDataMap[msg.sender] = CandidateData(0, _electionId, _name);
  }

  function voteForCandidate(uint _electionId, address _candidateId) public noReentrancy {
    require(!voters[msg.sender], "You have already voted for a candidate.");
    require(getKeccak(candidateToCandidateDataMap[_candidateId].name) != getKeccak(""), "This address does not belong to a candidate.");
    require(
      block.timestamp > elections[_electionId].registrationEndPeriod
      && block.timestamp < elections[_electionId].votingEndPeriod,
      "Voting is not allowed now."
    );
    candidateToCandidateDataMap[_candidateId].voteCount++;
    voters[msg.sender] = true;
  }

  function getCandidateData(address _candidateId) public view returns(uint, string memory) {
    CandidateData storage data = candidateToCandidateDataMap[_candidateId];
    return (data.voteCount, data.name);
  }

  function getResults(uint _electionId) public view returns(address[] memory, uint) {
    Election storage election = elections[_electionId];
    return (election.candidates, election.votingEndPeriod);
  }
}