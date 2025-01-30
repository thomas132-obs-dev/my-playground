import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import Chessboard from "./Chessboard";
import { Chess } from "chess.js";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../states/AuthContext";

const GameRoom = () => {
  const [roomId, setRoomId] = useState(""); // For the host (created room)
  const [joinRoomId, setJoinRoomId] = useState(""); // For the joining player
  const [gameState, setGameState] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const game = new Chess();
  const { signOut } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    signOut(); // Sign out using Auth Context
    navigate("/"); // Redirect to login page
    localStorage.clear();
  };

  // Create a new game room
  const createRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(7);
    console.log("newRoomId", newRoomId);
    // Convert board into a flat structure with piece positions
    const boardState = {};
    game.board().forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        if (square) {
          const position = `${String.fromCharCode(97 + colIndex)}${
            8 - rowIndex
          }`;
          boardState[position] = { type: square.type, color: square.color };
        }
      });
    });

    await setDoc(doc(db, "games", newRoomId), {
      board: boardState, // Now an object instead of nested arrays
      turn: "w",
      status: "waiting",
    });

    setRoomId(newRoomId); // Set the room ID for the host
    setIsHost(true);
  };

  // Join an existing game room
  const joinRoom = async () => {
    const roomRef = doc(db, "games", joinRoomId);
    const roomSnapshot = await getDoc(roomRef);
    if (roomSnapshot.exists()) {
      const roomData = roomSnapshot.data();
      const chess = new Chess();

      // Reconstruct board from stored positions
      chess.clear();
      Object.entries(roomData.board).forEach(([position, piece]) => {
        chess.put({ type: piece.type, color: piece.color }, position);
      });

      setGameState(roomData);
      setRoomId(joinRoomId); // Set the room ID for the joining player
      setIsHost(false);
    } else {
      alert("Room not found!");
    }
  };

  // Listen for game state updates
  useEffect(() => {
    if (roomId) {
      const roomRef = doc(db, "games", roomId);
      const unsubscribe = onSnapshot(roomRef, (doc) => {
        if (doc.exists()) {
          setGameState(doc.data());
        }
      });
      return () => unsubscribe();
    }
  }, [roomId]);

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 p-3 cursor-pointer px-5 rounded-lg">
        Logout
      </button>
      <div>
        <button onClick={createRoom} className="border-2">
          Create Room
        </button>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
          className="border-2"
        />
        <button className="border-2" onClick={joinRoom}>
          Join Room
        </button>
      </div>

      {roomId && (
        <div>
          <Chessboard
            gameState={gameState}
            roomId={roomId}
            isHost={isHost}
            setGameState={setGameState}
          />
        </div>
      )}
    </div>
  );
};

export default GameRoom;
