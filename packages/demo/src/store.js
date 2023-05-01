import create from "zustand";
import { persist } from "zustand/middleware";

import { makeid } from "./utils";

const useStore = create(
  persist(
    (set) => ({
      todos: [],
      completeTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: true, completionDate: new Date().toLocaleDateString() } : todo
          ),
        })),
      uncompleteTodo: (id) =>
        set((state) => ({ todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: false } : todo)) })),
      createTodo: (title) => set((state) => ({ todos: [...state.todos, { id: makeid(5), title, completed: false }] })),
      deleteTodo: (id) => set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
    }),
    {
      name: "todo-storage",
    }
  )
);

export default useStore;
