"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type ToDo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/todo")
        .then((res) => res.json())
        .then(setTodos)
        .catch((err) => console.error(err));
    }
  }, [status]);

  const addTodo = async () => {
    if (!newTodo) return;

    const res = await fetch("/api/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });

    if (res.ok) {
      const todo: ToDo = await res.json();
      setTodos([...todos, todo]);
      setNewTodo("");
    } else {
      console.error("Failed to add ToDo");
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    const res = await fetch("/api/todo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed }),
    });

    if (res.ok) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } else {
      console.error("Failed to toggle ToDo");
    }
  };

  const deleteTodo = async (id: number) => {
    const res = await fetch("/api/todo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setTodos(todos.filter((todo) => todo.id !== id));
    } else {
      console.error("Failed to delete ToDo");
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated") {
    return (
      <div>
        <h1>Welcome to ToDo App</h1>
        <button type="button" onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return (
    <div>
      <h1>ToDo App</h1>
      <button type="button" onClick={() => signOut()}>Sign Out</button>
      <div>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="button" onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
            />
            {todo.title}
            <button type="button" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
