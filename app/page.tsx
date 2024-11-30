"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./page.module.css";

type ToDo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function HomePage() {
  const { status } = useSession();
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/todo")
        .then((res) => res.json())
        .then((obj) => { console.log(obj); setTodos(obj); })
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
      body: JSON.stringify({ id, completed: !completed }),
    });

    if (res.ok) {
      // console.log(await res.json());
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
      <div className={styles.todoApp}>
        <h1 className={styles.title}>Welcome to ToDo App</h1>
        <button type="button" className={`${styles.button} ${styles.signOut}`} onClick={() => signIn()}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className={styles.todoApp}>
      <h1 className={styles.title}>ToDo App</h1>
      <div className={styles.signOutContainer}>
        <button type="button" className={`${styles.button} ${styles.signOut}`} onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
      <div className={styles.todoInput}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="button" className={`${styles.button} ${styles.addButton}`} onClick={addTodo}>
          Add
        </button>
      </div>
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`${styles.todoItem} ${todo.completed ? styles.completed : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
            />
            <span>{todo.title}</span>
            <button type="button"
              className={`${styles.button} ${styles.deleteButton}`}
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
