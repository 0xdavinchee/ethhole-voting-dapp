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

  function startElection(uint _registrationEndPeriod, uint _votingEndPeriod) public {
    require(_registrationEndPeriod >= block.timestamp && _votingEndPeriod >= _registrationEndPeriod);
    Election storage election = elections[numElections++];
    election.registrationEndPeriod = _registrationEndPeriod;
    election.votingEndPeriod = _votingEndPeriod;
  }

  function registerCandidate(uint _electionId, string memory _name) public {
    require(block.timestamp < elections[_electionId].registrationEndPeriod, "The registration period has ended.");
    require(candidateToCandidateDataMap[msg.sender].electionId == 0, "You have already registered for an election.");
    elections[_electionId].candidates.push(msg.sender);
    candidateToCandidateDataMap[msg.sender] = CandidateData(0, _electionId, _name);
  }

  function voteForCandidate(address _candidateId) public noReentrancy {
    require(!voters[msg.sender], "You have already voted for a candidate.");
    candidateToCandidateDataMap[_candidateId] = CandidateData(
      candidateToCandidateDataMap[_candidateId].voteCount++, 
      candidateToCandidateDataMap[_candidateId].electionId,
      candidateToCandidateDataMap[_candidateId].name
    );
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
