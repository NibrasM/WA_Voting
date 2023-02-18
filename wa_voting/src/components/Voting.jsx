import { useEffect } from "react";
import { useState } from "react";
import PartyCard from "./PartyCard";
import { useCookies } from "react-cookie";
import Logout from "./Logout";

const parties = [
  {
    name: "dog",
    votes: 0,
  },
  {
    name: "cat",
    votes: 0,
  },
  {
    name: "cow",
    votes: 0,
  },
  {
    name: "lion",
    votes: 0,
  },
];

export default function Voting(logIn) {
  const [partiesArray, setPartiesArray] = useState(parties);
  const [selectedParty, setSelectedParty] = useState();
  const [isVoted, setIsVoted] = useState(false);
  const [cookies, setCookie] = useCookies(["loggedInUser"]);

  useEffect(() => {
    const pariesData = localStorage.getItem("parties");
    if (pariesData) {
      setPartiesArray(JSON.parse(pariesData));
    } else {
      localStorage.setItem("parties", JSON.stringify(parties));
    }

    const users = JSON.parse(localStorage.getItem("users"));
    const loggedInUser = cookies.loggedInUser;
    if (users && loggedInUser) {
      const foundUser = users.find((user) => user.name === loggedInUser.name);
      setIsVoted(foundUser.isVoted);
    }
  }, []);

  const done = () => {
    localStorage.setItem("parties", JSON.stringify(partiesArray));

    const users = JSON.parse(localStorage.getItem("users"));
    const loggedInUser = cookies.loggedInUser;
    if (users && loggedInUser) {
      const foundUser = users.find((user) => user.name === loggedInUser.name);
      foundUser.isVoted = true;
      localStorage.setItem("users", JSON.stringify(users));
      setIsVoted(true);
    }
  };

  const change = () => {
    if (selectedParty) {
      const partiesCopy = [...partiesArray];
      const foundParty = partiesCopy.find(
        (currentParty) => currentParty.name === selectedParty
      );
      foundParty.votes = foundParty.votes - 1;
      setPartiesArray(partiesCopy);
    }
  };

  return isVoted ? (
    <Logout logIn={logIn}></Logout>
  ) : (
    <div>
      (<label>LoggedIn username</label>
      {partiesArray.map((party) => {
        return (
          <PartyCard
            key={party.name}
            party={party}
            parties={partiesArray}
            setParties={setPartiesArray}
            setSelectedParty={setSelectedParty}
          ></PartyCard>
        );
      })}
      <button onClick={done}>done</button>
      <button onClick={change}>change</button>
    </div>
  );
}
