import { View, Text, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';
import { Col, Grid } from 'react-native-easy-grid';

let board = Array();
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;

export default function Gameboard() {
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
    const [status, setStatus] = useState('');
    const [gameFinished, setGameFinished] = useState(false);
    const [roundCounter, setRoundCounter] = useState(1);
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedPoints, setSelectedPoints] = useState(new Array(6).fill(false));
    const [spotCounts, setSpotCounts] = useState(new Array(6).fill(0));
    const [compareArray, setCompareArray] = useState([]);
    const [points, setPoints] = useState(0);
    const [disabledDie, setDisabledDie] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const row = Array();
    const spotCountRow = Array();

    for (let i = 0; i < NBR_OF_DICES; i++) {
        row.push(
            <Pressable
                key={'row' + i}
                onPress={() => selectDice(i)}
                disabled={disabledDie}
            >
                <MaterialCommunityIcons
                    name={board[i]}
                    key={'row' + i}
                    size={50}
                    color={getDiceColor(i)}
                />
            </Pressable>
        )
    }

    for (let j = 0; j < 6; j++) {
        spotCountRow.push(
            <Col style={styles.spotCountsContainer} key={'spot-col-' + j}>
                <Text style={styles.spotCountPoints}>{spotCounts[j]}</Text>
                <Pressable
                    key={'row' + j}
                    onPress={() => confirmPointSelection(j)}
                    disabled={selectedPoints[j]}
                >
                    <MaterialCommunityIcons
                        name={'numeric-' + (j + 1) + '-circle'}
                        key={'icon' + j}
                        size={50}
                        color={getIconColor(j)}
                    />
                </Pressable>
            </Col>
        )
    }

    useEffect(() => {
        // after each throw handle game status
        handleGameStatus();
        // when last throw of the round is made

        if (nbrOfThrowsLeft < 0) {
            handleRoundEnd();
        }
    }, [selectedDices, nbrOfThrowsLeft, confirmed]);

    function handleRoundEnd() {
        // start of a new round if each point has a value assigned
        if (spotCounts.every((val, i, arr) => val !== 0)) {
            setSpotCounts(new Array(6).fill(0))
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
            setSelectedPoints(new Array(NBR_OF_DICES).fill(false));
            setDisabledDie(true);
            setGameFinished(false);
            setRoundCounter(0);
            setGameFinished(true);
            setCompareArray([]);
        } else {
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
            setDisabledDie(true);
            setNbrOfThrowsLeft(NBR_OF_THROWS);
            setCompareArray([]);
            setRoundCounter(roundCounter + 1);
            setConfirmed(false);
        }
    }


    // Throw dices
    function throwDices() {
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
            }
            setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
            setDisabledDie(false);
            setGameFinished(false);
        }
    }

    // Dice color
    function getDiceColor(i) {
        return selectedDices[i] ? 'black' : 'steelblue';
    }

    // Icon color
    function getIconColor(j) {
        return selectedPoints[j] ? 'black' : 'steelblue';
    }

    // Dice selection
    function selectDice(i) {
        // Selected die value
        let selectionValue = Number(board[i].replace("dice-", ""));
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        validateSelection(i, selectionValue);
        setSelectedDices(dices);
        calculatePoints(i, selectionValue);
    }

    // Check if all selected values are equal
    function validateSelection(i, num) {
        let selection = num;
        let compareArrayClone = [...compareArray];

        if (!selectedDices[i]) {
            // Push selected point value to compareArrayClone
            compareArrayClone.push(selection);
            setCompareArray(compareArrayClone);
        }
        // else remove from compareArray
        else {
            let popIndex = compareArrayClone.indexOf(selection);
            compareArrayClone.splice(popIndex, 1);
            setCompareArray(compareArrayClone);
        }
    }

    // Calculate points
    function calculatePoints(i, num) {
        let pointsToAdd = num;
        let spotCountClone = [...spotCounts];
        // index of the array to add points to
        let index = pointsToAdd - 1;

        // If dice is not already selected, increment points to spotCountClone[i]
        if (!selectedDices[i]) {
            spotCountClone[index] += pointsToAdd;
        }
        // Else subtract points
        else {
            spotCountClone[index] -= pointsToAdd;
        }
        // To display points in the UI
        setSpotCounts(spotCountClone);

        // Lastly calculate the sum of the array's values to keep track of total points
        let sum = spotCountClone.reduce((currentVal, nextVal) => currentVal + nextVal);
        setPoints(sum);
    }

    function confirmPointSelection(j) {
        let confirm = [...selectedPoints];

        if (nbrOfThrowsLeft !== 0) {
            setStatus('Wait for last throw before selecting your points')
        } else if (roundCounter === 6 && nbrOfThrowsLeft === 0) {
            setSelectedPoints(confirm);
            setConfirmed(true);
            confirm[j] = true;
        }
        /* Checks if selected spot count is not zero and if selected values are all equal, confirming the selection is then made. */
        else if (spotCounts[j] !== 0 && compareArray.every((val) => val === compareArray[0]) === true) {
            let confirm = [...selectedPoints];
            confirm[j] = true;
            setSelectedPoints(confirm);
            setConfirmed(true);
        } else {
            setStatus('Wrong selection')
        }
    }

    function handleGameStatus() {
        // Status text after round is finished
        if (roundCounter > 1 && nbrOfThrowsLeft === NBR_OF_THROWS) {
            setStatus(`Throw to start round ${roundCounter}.`);
        }
        // Initial game status
        else if (nbrOfThrowsLeft === NBR_OF_THROWS) {
            setStatus('Game has not started.');
        }
        // If throws left
        else if (nbrOfThrowsLeft > 0) {
            setStatus('Make your selection and throw again.');
        }
        // Last throw is done

        if (nbrOfThrowsLeft === 0) {
            setButtonDisabled(true);
            // Check if every value selected was the same
            if (compareArray.every((val) => val === compareArray[0]) === false) {
                setStatus('You can only select one value to add points to.')
            }
            // If no dice are selected
            else if (selectedDices.every((val, i, arr) => val === false)) {
                setStatus('Please select at least one die to assign points.');
            }
            else if (!confirmed) {
                setStatus('Confirm your point selection.');
            }
            else {
                setDisabledDie(true);
                setStatus('Press the button to continue.')
                setButtonDisabled(false);
            }
        }
    }

    return (
        <View style={styles.gameboard}>
            <View style={styles.flex}>
                {row}
            </View>
            {!gameFinished ?
                <View>
                    <Text style={styles.gameinfo}>{status}</Text>
                </View>
                :
                <View>
                    <Text style={styles.points}>Game is now finished.</Text>
                    <Text style={styles.points}>Your points: {points}</Text>
                    {points >= 63 && <Text style={styles.gameinfo}>You got the bonus!</Text>}
                </View>
            }
            <View>
            </View>
            <View>
                <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            </View>
            <Pressable
                style={!buttonDisabled ? styles.button : [styles.button, styles.disabled]}
                onPress={throwDices}
                disabled={buttonDisabled}
            >
                <Text style={styles.buttonText}>
                    {nbrOfThrowsLeft <= 0 && !gameFinished ? "Next round" : gameFinished ? "Restart game" : "Throw dice"}
                </Text>
            </Pressable>
            <View style={styles.flex}>
                <Grid>
                    {spotCountRow}
                </Grid>
            </View>
        </View >
    );
}
