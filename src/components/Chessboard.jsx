import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import {
  FaRegChessPawn,
  FaRegChessRook,
  FaRegChessKnight,
  FaRegChessBishop,
  FaRegChessQueen,
  FaRegChessKing,
  FaChessKing,
} from "react-icons/fa6";
import {
  FaChessBishop,
  FaChessKnight,
  FaChessPawn,
  FaChessQueen,
  FaChessRook,
} from "react-icons/fa";
import { BiMoon, BiSun } from "react-icons/bi";
import "./Chessboard.css";

const Chessboard = ({ gameState, roomId, isHost, setGameState }) => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [board, setBoard] = useState(game.board());
  const [turnMessage, setTurnMessage] = useState("");
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [isOutline, setIsOutline] = useState(
    JSON.parse(localStorage.getItem("isOutline")) || false
  );

  useEffect(() => {
    if (gameState) {
      setGame(new Chess(gameState.fen));
    }
  }, [gameState]);

  // Update board state when game changes
  useEffect(() => {
    setBoard(game.board());
  }, [game]);

  const playerTurn = game.turn();
  useEffect(() => {
    const message = playerTurn === "b" ? "Black's Turn" : "White's Turn";
    setTurnMessage(message);
    Toastify({
      text: message,
      duration: 2000,
      gravity: "top",
      position: "center",
      style: {
        innerHeight: 10,
        background: "linear-gradient(to right,rgb(0, 99, 25),rgb(0, 158, 21))",
      },
    }).showToast();
  }, [playerTurn]);

  // Handle square clicks
  const handleSquareClick = async (row, col) => {
    const position = `${String.fromCharCode(97 + col)}${8 - row}`;
    if (!selectedSquare) {
      const piece = game.get(position);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(position);
      }
    } else {
      try {
        const move = game.move({ from: selectedSquare, to: position });
        if (move) {
          // Update Firestore with new game state
          await updateDoc(doc(db, "games", roomId), {
            fen: game.fen(),
            turn: game.turn(),
          });
          setSelectedSquare(null);
        } else {
          showToast("Invalid move!");
        }
      } catch (error) {
        console.error("Firestore update error:", error);
        showToast(error);
        setSelectedSquare(null);
      }
    }
  };

  // Show toast notifications
  const showToast = (message) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",

      style: {
        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
      },
    }).showToast();
  };

  // Render the board
  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((square, colIndex) => {
          const position = `${String.fromCharCode(97 + colIndex)}${
            8 - rowIndex
          }`;
          const isSelected = selectedSquare === position;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`square  ${isHost ? "rotate-0" : "rotate-180"} ${
                (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
              } ${isSelected ? "selected" : ""}`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}>
              {square && (
                <span
                  className={`piece ${
                    square.color === "w" ? "white" : "black"
                  }`}>
                  {getPieceSymbol(square.type)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  // Get piece symbols
  const getPieceSymbol = (piece) => {
    const symbols = {
      p: isOutline ? (
        <FaRegChessPawn className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ) : (
        <FaChessPawn className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ),
      r: isOutline ? (
        <FaRegChessRook className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ) : (
        <FaChessRook className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ),
      n: isOutline ? (
        <FaRegChessKnight className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ) : (
        <FaChessKnight className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ),
      b: isOutline ? (
        <FaRegChessBishop className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ) : (
        <FaChessBishop className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ),
      q: isOutline ? (
        <FaRegChessQueen className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ) : (
        <FaChessQueen className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ),
      k: isOutline ? (
        <FaRegChessKing className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ) : (
        <FaChessKing className={`${isHost ? "rotate-0" : "rotate-180"}`} />
      ),
    };
    return symbols[piece];
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  // Toggle outline mode
  const toggleOutlineMode = () => {
    const newOutlineMode = !isOutline;
    setIsOutline(newOutlineMode);
    localStorage.setItem("isOutline", JSON.stringify(newOutlineMode));
  };

  // Check for game over
  console.log(game);
  useEffect(() => {
    if (game.isGameOver()) {
      showToast(
        `Game over! Result: ${game.isCheckmate() ? "Checkmate" : "Draw"}`
      );
    }
  }, [board]);

  return (
    <div
      className={`app flex flex-col  md:flex-row ${
        darkMode ? "dark" : "light"
      } `}>
      <div>
        <button onClick={toggleOutlineMode} className="toggle-dark-mode ">
          {isOutline ? <FaRegChessKing /> : <FaChessKing />}
        </button>
        <button onClick={toggleDarkMode} className="toggle-dark-mode">
          {darkMode ? <BiMoon /> : <BiSun />}
        </button>
        <div>
          Room Id : {roomId}
          <br />
          {isHost ? "Host" : "Visitor"}
        </div>
      </div>
      <div className="chessboard">{renderBoard()}</div>

      <div>{turnMessage}</div>
    </div>
  );
};

export default Chessboard;
