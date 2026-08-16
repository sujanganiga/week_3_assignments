import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tab, setTab] = useState("stopwatch");

  return (
    <div className="container">
      <h1>Timer Lab</h1>

      <div className="tabs">
        <button onClick={() => setTab("stopwatch")}>
          Stopwatch
        </button>

        <button onClick={() => setTab("countdown")}>
          Countdown
        </button>

        <button onClick={() => setTab("pomodoro")}>
          Pomodoro
        </button>
      </div>

      {tab === "stopwatch" && <Stopwatch />}

      {tab === "countdown" && <Countdown />}

      {tab === "pomodoro" && <Pomodoro />}
    </div>
  );
}

// ---------------- STOPWATCH ----------------

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
  };

  return (
    <div className="timer">
      <h2>Stopwatch</h2>

      <h1>{formatTime(seconds)}</h1>

      <button onClick={() => setRunning(true)}>
        Start
      </button>

      <button onClick={() => setRunning(false)}>
        Pause
      </button>

      <button onClick={reset}>
        Reset
      </button>
    </div>
  );
}

// ---------------- COUNTDOWN ----------------

function Countdown() {
  const [minutes, setMinutes] = useState(0);
  const [secondsInput, setSecondsInput] = useState(30);

  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || time <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTime((previous) => previous - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [running, time]);

  useEffect(() => {
    if (time === 0 && running) {
      setRunning(false);
    }
  }, [time, running]);

  const start = () => {
    if (time === 0) {
      const totalSeconds =
        Number(minutes) * 60 + Number(secondsInput);

      setTime(totalSeconds);
    }

    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setTime(0);
  };

  return (
    <div className="timer">
      <h2>Countdown</h2>

      {!running && time === 0 && (
        <div>
          <input
            type="number"
            min="0"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />

          <input
            type="number"
            min="0"
            max="59"
            value={secondsInput}
            onChange={(e) =>
              setSecondsInput(e.target.value)
            }
          />
        </div>
      )}

      <h1>{formatTime(time)}</h1>

      {time === 0 && !running && <p>Time's up!</p>}

      <button onClick={start}>Start / Resume</button>

      <button onClick={() => setRunning(false)}>
        Pause
      </button>

      <button onClick={reset}>Reset</button>
    </div>
  );
}

// ---------------- POMODORO ----------------

function Pomodoro() {
  const [time, setTime] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  const [phase, setPhase] = useState("Focus");
  const [cycle, setCycle] = useState(1);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = setInterval(() => {
      setTime((previous) => previous - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [running]);

  useEffect(() => {
    if (time > 0) {
      return;
    }

    if (phase === "Focus") {
      setPhase("Break");
      setTime(5 * 60);
    } else {
      setPhase("Focus");
      setTime(25 * 60);
      setCycle((previous) => previous + 1);
    }
  }, [time, phase]);

  const reset = () => {
    setRunning(false);
    setPhase("Focus");
    setTime(25 * 60);
    setCycle(1);
  };

  return (
    <div className="timer">
      <h2>Pomodoro</h2>

      <h3>{phase}</h3>

      <h1>{formatTime(time)}</h1>

      <p>Cycle: {cycle}</p>

      <button onClick={() => setRunning(true)}>
        Start
      </button>

      <button onClick={() => setRunning(false)}>
        Pause
      </button>

      <button onClick={reset}>
        Reset
      </button>
    </div>
  );
}

// ---------------- FORMAT TIME ----------------

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

export default App;