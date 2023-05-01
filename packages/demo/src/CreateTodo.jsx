import React from 'react'
import useStore from './store'

export default function CreateTodo() {
  const createTodo = useStore(state => state.createTodo)
  const [isCreate, setIsCreate] = React.useState(false)
  const [title, setTitle] = React.useState('')

  const onCreate = (e) => {
    e.preventDefault()
    createTodo(title)
    setTitle('')
    setIsCreate(false)
  }

  if (isCreate) {
    return (
      <form onSubmit={onCreate} className="relative">
        <input
          data-test="create-todo-input"
          placeholder='What needs to be done?'
          autoFocus
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="bg-white-200 rounded-xl py-3.5 px-4 w-full text-sm"
        />
        <button data-test="create-todo-button" title="Create" type="submit" className="absolute rounded //bg-green-400 right-2 text-red-200 top-1 py-1 px-2">🔥</button>
      </form>
    )
  }

  return (
    <>
    <button
      data-test="create-todo-button"
      onClick={() => setIsCreate(true)}
      className="font-medium text-indigo-900 hover:text-indigo-700 bg-green-200 rounded-xl py-2 px-4 w-full"
      >
      Create Todo
    </button>
      </>
  )
}
