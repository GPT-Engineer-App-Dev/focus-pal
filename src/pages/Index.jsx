import React, { useState, useEffect } from "react";
import { Box, Button, Container, Heading, Text, VStack, useToast, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { FaPlay, FaPause, FaSync } from "react-icons/fa";

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [mode, setMode] = useState("work"); // 'work' or 'break'
  const toast = useToast();

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => {
          if (seconds > 0) return seconds - 1;
          // Time is up
          setIsRunning(false);
          clearInterval(interval);
          switchMode();
          return 0;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const switchMode = () => {
    if (mode === "work") {
      setMode("break");
      setSecondsLeft(5 * 60); // 5 minutes break
      toast({
        title: "Time for a break!",
        description: "You've completed a Pomodoro, take a short break.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setMode("work");
      setSecondsLeft(25 * 60); // 25 minutes work
      toast({
        title: "Back to work!",
        description: "Break's over, let's get back to work!",
        status: "info",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
    setMode("work");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Container centerContent p={4}>
      <VStack spacing={4}>
        <Heading>Pomodoro Timer</Heading>
        <CircularProgress value={(secondsLeft / (mode === "work" ? 25 * 60 : 5 * 60)) * 100} size="120px" thickness="6px" color="red.500">
          <CircularProgressLabel>{formatTime(secondsLeft)}</CircularProgressLabel>
        </CircularProgress>
        <Text fontSize="xl">{mode === "work" ? "Work Time" : "Break Time"}</Text>
        <Box>
          <Button leftIcon={isRunning ? <FaPause /> : <FaPlay />} onClick={toggleTimer} colorScheme="blue" mr={3}>
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button leftIcon={<FaSync />} onClick={resetTimer} colorScheme="gray">
            Reset
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
