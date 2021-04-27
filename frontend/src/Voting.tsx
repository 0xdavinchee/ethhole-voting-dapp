import React, { useContext, useEffect, useState } from "react";
import DateTime from "react-datetime";
import moment from "moment";

interface Props {}

const Voting: React.FC<Props> = () => {
  const [registrationEnd, setRegistrationEnd] = useState(new Date());
  const [votingEnd, setVotingEnd] = useState(new Date());

  const convertDate = (date: moment.Moment) => {
    return date.toDate().getTime();
  };
  return (
    <div>
      <h1>Elections</h1>
      <label>Registration End Date/Time</label>
      <DateTime
        value={registrationEnd}
        onChange={(e: string | moment.Moment) =>
          setRegistrationEnd((e as moment.Moment).toDate())
        }
      />
      <label>Voting End Date/Time</label>
      <DateTime
        value={votingEnd}
        onChange={(e: string | moment.Moment) =>
          setVotingEnd((e as moment.Moment).toDate())
        }
      />
    </div>
  );
};

export default Voting;
