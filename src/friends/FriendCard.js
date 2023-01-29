import React from "react";
import { Image } from "react-bootstrap/esm";
import { createStyles, Text, Card, RingProgress, Group } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    width: "18rem",
    height: "12rem",
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1,
  },

  inner: {
    display: "flex",

    [theme.fn.smallerThan(350)]: {
      flexDirection: "column",
    },
  },

  ring: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",

    [theme.fn.smallerThan(350)]: {
      //justifyContent: "center",
      marginTop: theme.spacing.md,
    },
  },
}));

export function FriendCard({ friend }) {
  const { classes, theme } = useStyles();

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div>
        <div className={classes.inner}>
          <div>
            <Text size="xl" className={classes.label}>
              {`@${friend.username}`}
            </Text>
            <div>
              <Text className={classes.lead} mt={30}>
                Net Worth
              </Text>
              <Text size="xs" color="dimmed">
                $
                {friend.username == "jackson"
                  ? 967.14 + 1284.52
                  : 844.31 + 1842.53}
              </Text>
            </div>
            <Group mt="md">
              <div>
                <Text className={classes.label}>Cash</Text>
                <Text size="md" color="dimmed">
                  {`$${friend.cash.toFixed(2)}`}
                </Text>
              </div>
              <div>
                <Text className={classes.label}>Stocks</Text>
                <Text size="md" color="dimmed">
                  ${friend.username == "jackson" ? 1284.52 : 1842.53}
                </Text>
              </div>
            </Group>
          </div>
        </div>

        <div className={classes.ring}></div>
        <div
          style={{
            left: "60%",
            bottom: "127px",
            paddingRight: "216px",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "300px",
          }}
        >
          <Image roundedCircle src={friend.profilePicURL} width={"100px"} />
        </div>
      </div>
    </Card>
  );
}

export default FriendCard;

// <Image src="https://api.dicebear.com/5.x/bottts-neutral/svg?seed=stickneyaiden" />
