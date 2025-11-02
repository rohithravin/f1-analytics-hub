// src/components/MathAdd.tsx
import { useState } from "react";
import { mathAdd } from "../api/f1Service";

export default function MathAdd() {
  const [x, setX] = useState(""); // store as string for text input
  const [y, setY] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    // Convert inputs to numbers
    const numX = Number(x);
    const numY = Number(y);

    if (isNaN(numX) || isNaN(numY)) {
      alert("Please enter valid numbers");
      return;
    }

    setLoading(true);
    try {
      const res = await mathAdd(numX, numY);
      setResult(res.result);
    } catch (err) {
      alert("Failed to add numbers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Math Add</h2>
      <input
        type="text"
        value={x}
        onChange={(e) => setX(e.target.value)}
        placeholder="Enter x"
      />
      <input
        type="text"
        value={y}
        onChange={(e) => setY(e.target.value)}
        placeholder="Enter y"
      />
      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Calculating..." : "Add"}
      </button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}
