"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, FormEvent } from "react";

type Todo = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

export default function TodoApp() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const createTodo = (newTodo: { title: string; description: string }) => {
    return new Promise<Todo>((resolve) => {
      const newTodoItem: Todo = {
        id: Date.now(),
        title: newTodo.title,
        description: newTodo.description,
        createdAt: new Date().toISOString(),
      };

      const updatedTodos = [...todos, newTodoItem];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);

      resolve(newTodoItem);
    });
  };

  const updateTodo = (updatedTodo: Todo) => {
    return new Promise<Todo>((resolve) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
      resolve(updatedTodo);
    });
  };

  const deleteTodo = (id: number) => {
    return new Promise<number>((resolve) => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
      resolve(id);
    });
  };

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      console.log("Todo created successfully!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Error creating todo:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      console.log("Todo updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Error updating todo:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      console.log("Todo deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Error deleting todo:", error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-0 sm:flex lg:flex-col sm:gap-4"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Title"
          className="w-full p-2 border rounded outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Description"
          className="w-full p-2 border rounded outline-none"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Todo
        </button>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[600px] border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo: Todo) => (
              <tr key={todo.id} className="text-sm sm:text-base">
                <td className="border p-2 break-words">{todo.title}</td>
                <td className="border p-2 break-words">{todo.description}</td>
                <td className="border p-2">
                  {new Date(todo.createdAt).toLocaleString()}
                </td>
                <td className="border p-2 space-y-1 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => {
                      const updatedTitle = prompt("Edit Title", todo.title);
                      const updatedDescription = prompt(
                        "Edit Description",
                        todo.description
                      );
                      if (updatedTitle && updatedDescription) {
                        updateMutation.mutate({
                          ...todo,
                          title: updatedTitle,
                          description: updatedDescription,
                        });
                      }
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 w-full sm:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(todo.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
