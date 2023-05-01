import React from 'react'
import ReactDOM from 'react-dom'

import TodoList from './TodoList'
import CreateTodo from './CreateTodo'

import './static/index.css'

ReactDOM.render(
  <React.StrictMode>
    <div className="h-screen bg-gradient-to-r to-indigo-500 from-purple-500 bg-indigo-900 flex flex-col items-center justify-center">
      <div className="w-80 space-y-2 text-2xl">
        <CreateTodo />
        <TodoList />
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)
