import React, { useContext, useEffect } from "react";
import { VotingContext } from "./hardhat/SymfoniContext";

interface Props {}

const Voting: React.FC<Props> = () => {
  const voting = useContext(VotingContext);

  useEffect(() => {
    (async () => {
      if (!voting.instance) return;
      console.log(voting.instance.address);
      try {
        const elections = await voting.instance.getElectionsCount();
        console.log("num elections", elections.toNumber());
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, [voting]);

  const startElection = (registrationEnd: number, votingEnd: number) => {
    if (!voting.instance) return;
    voting.instance.startElection(2,3);
  }
  return (
    <div>
      <p>Hello world</p>
    </div>
  );
};

export default Voting;
