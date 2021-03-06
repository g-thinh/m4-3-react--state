import React from "react";
import styled from "styled-components";

const Typeahead = ({ suggestions, handleSelect }) => {
  //this state sets the current value of the user input
  const [value, setValue] = React.useState("");

  //this state is to make sure that the suggestions list only renders
  //when the isVisible variable is set to true, triggered when there
  //is an existing match from input and user is on the input element
  const [isVisible, setIsVisible] = React.useState(false);

  //this state manages the indices of the search results, index of course starts at 0
  //the first search return if there is one.
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(
    0
  );

  //this will filter out the { suggestions } props to ones that match
  //user input, to validate through case-sensitivity, we compare the user
  //input and the suggestions by coercing them into being both lowercase.
  const matchedSuggestions = suggestions.filter(
    (suggestion) => suggestion.title.toLowerCase().includes(value.toLowerCase())
    //only downside to this is that even a blank char matches
    //so must add that factor into the below showSuggestions boolean
  );

  //if there are any matching suggestions, return a true boolean
  //the user input must be greater than 2 characters and the user must be
  //on the input element
  let showSuggestions =
    matchedSuggestions.length > 0 && isVisible && value.length > 2;

  return (
    <Wrapper>
      <InputContainer>
        <Input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          //onKeyDown = {(event => console.log(event.key))}
          onFocus={() => {
            setIsVisible(true);
          }}
          onKeyDown={(event) => {
            // console.log("START:", selectedSuggestionIndex);
            // console.log(event.key);

            switch (event.key) {
              case "Enter": {
                handleSelect(event.target.value);
                return;
              }
              case "ArrowUp": {
                // console.log("index:", selectedSuggestionIndex);
                setSelectedSuggestionIndex(selectedSuggestionIndex - 1);

                // This is make sure the user cannot use the up arrow on the first
                //search result, i.e. the first result will always be yellow
                if (selectedSuggestionIndex <= 0) {
                  setSelectedSuggestionIndex(0);
                }
                //This console.log allows me to see what index im at for every
                //key press, and what suggestion is being selected
                // console.log(
                //   event.key,
                //   selectedSuggestionIndex,
                //   matchedSuggestions[selectedSuggestionIndex]
                // );
                return;
              }
              case "ArrowDown": {
                // console.log("index:", selectedSuggestionIndex);
                setSelectedSuggestionIndex(selectedSuggestionIndex + 1);

                // This is make sure the user cannot use the down arrow on the last
                //search result, i.e. the last result will always be yellow
                if (selectedSuggestionIndex >= matchedSuggestions.length - 1) {
                  setSelectedSuggestionIndex(matchedSuggestions.length - 1);
                }
                // console.log(
                //   event.key,
                //   selectedSuggestionIndex,
                //   matchedSuggestions[selectedSuggestionIndex]
                // );
                return;
              }
              case "Escape": {
                //if the user presses the escape key, then the dropdown dissapears
                //because the state changed, and the showSuggestions bool becomes false
                //therefore unable to render the <SearchResultList> element
                setIsVisible(false);
                return;
              }
            }
          }}
        />
        <Clear onClick={() => setValue("")}>Clear</Clear>
      </InputContainer>

      {/* conditional formatting here will only render the suggestions list
      if the validations goes through, otherwise the padding artifact
      will be displayed*/}
      {showSuggestions && (
        <SearchResultList>
          {matchedSuggestions.map((match, index) => {
            //this will index the first occurence of the user input value
            //needs to be compared while lower case to account for all possible
            //matches
            const matchIndex = match.title
              .toLowerCase()
              .indexOf(value.toLowerCase());

            //this will check if the index of the result matches with what the user
            //wants as the search index to be, from using the up and down arrows
            const isSelected = selectedSuggestionIndex === index;

            //use a return statement in order to include the above code
            return (
              <SearchResultItem
                key={match.id} //this is to remove that error, there is an id for ever result in the data file
                style={{
                  background: isSelected
                    ? "hsla(50deg, 100%, 80%, 0.25)"
                    : "transparent",
                }}
                onMouseEnter={() => {
                  //mousing over an item should select that item by its index
                  //update the state that holds that index
                  setSelectedSuggestionIndex(index);
                }}
              >
                <span>
                  {/* First Half */}
                  {/* the resulting match is a slice, from the beginning, to
                  where the value input matches the suggestion, also need to add 
                  the user input length because it will index the first char, but 
                  we want the whole word */}
                  {match.title.slice(0, matchIndex + value.length)}
                  {/* Second Half */}
                  <Prediction>
                    {/* this secondary span is just bolded, but is indexed from
                    where the first char matches, to the end of the suggestion match */}
                    {`${match.title.slice(matchIndex + value.length)}`}
                  </Prediction>
                </span>
                <span>{` in `}</span>
                <PredictionGenre>
                  {`${match.categoryId.toUpperCase()}`}
                </PredictionGenre>

                {/* {console.log(
                  `Index of Results: ${index}, Index of Word ${match.title
                    .toLowerCase()
                    .indexOf(value.toLowerCase())}`
                )} */}
              </SearchResultItem>
            );
          })}
        </SearchResultList>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

const InputContainer = styled.div`
  display: flex;
  /* border: 1px solid goldenrod; */

  /* padding: 50px; */
  border-radius: 12px;
  /* box-shadow: 2px 5px 20px rgba(0, 0, 0, 0.1); */
`;

const Input = styled.input`
  width: 400px;
  height: 50px;
  font-size: 22px;
  outline: none;
  border: 2px solid lightgray;
  border-radius: 12px;

  &:focus {
    /* background: salmon; */
    outline: 2px solid dodgerblue;
    box-shadow: 0 0 3px dodgerblue;
  }
`;

const Clear = styled.button`
  width: 100px;
  margin-left: 10px;
  border-radius: 10px;
  color: white;
  font-size: 22px;
  background-color: #4c0cd4;
  border: none;
  outline: none;

  &:hover {
    background: #ff0073;
    outline: none;
    cursor: pointer;
  }

  &:focus {
    outline: 2px solid dodgerblue;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SearchResultList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 10px 0;
  padding: 20px;

  width: 500px;
  /* border: 1px solid goldenrod; */
  box-shadow: 2px 5px 20px rgba(0, 0, 0, 0.1);

  &:after {
    /* padding: 15px; */
  }

  & li {
    width: 100%;
    line-height: 1.6;
    padding: 15px;
    /* font-weight: 600; */
  }

  /* & li:first-child {
    background: lightyellow;
  } */
`;

// I dont think i needed this, but it makes reading the elements easier
const SearchResultItem = styled.li``;

const Prediction = styled.span`
  font-weight: bolder;
`;

const PredictionGenre = styled.span`
  font-style: italic;
  color: purple;
`;

export default Typeahead;
