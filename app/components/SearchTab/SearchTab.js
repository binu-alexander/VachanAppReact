import React from "react";
import { Button, Segment, Text } from "native-base";
import { styles } from "./styles";
import Color from "../../utils/colorConstants";
const SearchResultTypes = {
  ALL: 0,
  OT: 1,
  NT: 2,
};

const SearchTab = (props) => {
  return (
    <Segment style={styles.container}>
      <Button
        style={[
          {
            backgroundColor:
              props.activeTab === SearchResultTypes.ALL
                ? Color.Blue_Color
                : Color.White,
          },
          styles.button,
        ]}
        onPress={() => props.toggleFunction(SearchResultTypes.ALL)}
        active={props.activeTab == SearchResultTypes.ALL ? true : false}
      >
        <Text
          active={props.activeTab}
          style={{
            color:
              props.activeTab == SearchResultTypes.ALL
                ? Color.White
                : Color.Blue_Color,
          }}
        >
          All
        </Text>
      </Button>
      <Button
        style={[
          {
            backgroundColor:
              props.activeTab == SearchResultTypes.OT
                ? Color.Blue_Color
                : Color.White,
          },
          styles.buttonCenter,
        ]}
        onPress={() => props.toggleFunction(SearchResultTypes.OT)}
        active={props.activeTab == SearchResultTypes.OT ? true : false}
      >
        <Text
          active={props.activeTab}
          style={{
            color:
              props.activeTab == SearchResultTypes.OT
                ? Color.White
                : Color.Blue_Color,
          }}
        >
          Old Testament
        </Text>
      </Button>
      <Button
        style={[
          {
            backgroundColor:
              props.activeTab == SearchResultTypes.NT
                ? Color.Blue_Color
                : Color.White,
          },
          styles.button,
        ]}
        onPress={() => props.toggleFunction(SearchResultTypes.NT)}
        active={props.activeTab == SearchResultTypes.NT ? true : false}
      >
        <Text
          active={props.activeTab}
          style={{
            color:
              props.activeTab == SearchResultTypes.NT
                ? Color.White
                : Color.Blue_Color,
          }}
        >
          New Testament
        </Text>
      </Button>
    </Segment>
  );
};
export default SearchTab;
