"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, FormEvent } from "react";
import axios from "axios";
import { Todo } from "@/types/Types";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await axios.get("/api/get");
  return res.data;
};

export default function TodoApp() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const createMutation = useMutation({
    mutationFn: (newTodo: { title: string; description: string }) =>
      axios.post("/api/create", newTodo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedTodo: Todo) =>
      axios.put(`/api/update/${updatedTodo.id}`, updatedTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditingTodo(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/delete/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingTodo) {
      updateMutation.mutate({ ...editingTodo, title, description });
    } else {
      createMutation.mutate({ title, description });
    }
    setTitle("");
    setDescription("");
    setEditingTodo(null);
  };
  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };
  const handleLogout = (e: any) => {
    signOut();
    e.preventDefault();
    router.push("auth/login");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between">
        <h1 className="text-green-400">Hi,{session?.user?.name}</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white p-2 px-4 rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
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
          className={`w-full ${
            editingTodo
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white py-2 rounded`}
        >
          {editingTodo ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      <div className="mt-6 overflow-x-auto">
        {isLoading ? (
          <p className="text-center">Loading todos...</p>
        ) : (
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
              {todos?.map((todo: Todo) => (
                <tr key={todo.id} className="text-sm sm:text-base">
                  <td className="border p-2 break-words">{todo?.title}</td>
                  <td className="border p-2 break-words">
                    {todo?.description}
                  </td>
                  <td className="border p-2">
                    {new Date(todo.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2 space-y-1 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 w-full sm:w-auto"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation?.mutate(todo.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
