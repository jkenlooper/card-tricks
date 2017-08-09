function visibilityFilter (state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

const defaultTodoList = [
  {
    text: 'Eat food',
    completed: true
  },
  {
    text: 'Exercise',
    completed: false
  }
]
function todos (state = defaultTodoList, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map(
        (todo, index) =>
          action.index === index
            ? { text: todo.text, completed: !todo.completed }
            : todo
      )
    default:
      return state
  }
}

function todoApp (state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    randomNumbers: randomNumbers(state.randomNumbers, action)
  }
}

function randomNumbers (state = [], action) {
  switch (action.type) {
    case 'ADD_NUMBER':
      return state.concat([action.number])
    case 'REMOVE_NUMBER':
      state.pop()
      return state
    default:
      return state
  }
}

export default todoApp
