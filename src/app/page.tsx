"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import TrashIcon from "../../public/trash.svg";
import AddIcon from "../../public/add.svg";

interface Task {
  id: number;
  title: string;
  description?: string;
  price: number;
  done: boolean;
}

export default function Home() {
  const [taskDetails, setTaskDetails] = useState<Task>({
    id: Date.now(),
    title: "",
    description: "",
    price: 0,
    done: false,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(savedTasks);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTaskDetails((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const addTask = () => {
    if (!taskDetails.title) return;
    const newTask = { ...taskDetails, id: Date.now() };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTaskDetails({
      id: Date.now(),
      title: "",
      description: "",
      price: 0,
      done: false,
    });
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const toggleSort = () => {
    const direction = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(direction);
    setTasks((tasks) =>
      [...tasks].sort((a, b) =>
        direction === "asc" ? a.price - b.price : b.price - a.price
      )
    );
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-2 border-slate-950 border-4">
      <div className="flex">
        <h1>Oak App</h1>
      </div>
      <div className="flex md:flex-row flex-col gap-8 justify-center items-center">
        <input
          type="text"
          name="title"
          value={taskDetails.title}
          onChange={handleInputChange}
          placeholder="Task Title"
        />
        <input
          type="text"
          name="description"
          value={taskDetails.description || ""}
          onChange={handleInputChange}
          placeholder="Task Description"
        />
        <input
          type="number"
          name="price"
          onChange={handleInputChange}
          placeholder="Task Price"
        />
        <label>
          Avaible:
          <input
            type="checkbox"
            name="done"
            checked={taskDetails.done}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={addTask}>
          <Image src={AddIcon} alt="Add" width={20} height={20} />
        </button>
      </div>
      <table className="border-slate-950 border-4 w-10/12">
        <thead className="border-4">
          <tr>
            <th className="p-4 text-center border-4">Title</th>
            <th className="p-4 text-center border-4">Description</th>
            <th className="p-4 text-center border-4">
              Price
              <button onClick={toggleSort}>
                {sortDirection === "asc" ? "↓" : "↑"}
              </button>
            </th>
            <th className="p-4 text-center border-4">Available</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="p-2 text-center border-4">
                <div className="w-full max-w-xs overflow-auto">
                  {task.title}
                </div>
              </td>
              <td className="p-2 text-center border-4">
              <div className="max-w-xs overflow-y-auto overflow-x-hidden">
                  {task.description}
                </div>
              </td>
              <td className="p-2 text-center border-4">${task.price}</td>
              <td className="p-2 text-center border-4">{task.done ? "Yes" : "No"}</td>
              <td className="p-2 text-center border-4">
                <button onClick={() => deleteTask(task.id)}>
                  <Image src={TrashIcon} alt="Delete" width={20} height={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
