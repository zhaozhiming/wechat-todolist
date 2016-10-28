//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    todo: '',
    todos: [],
    filterTodos: [],
    filter: 'all',
    userInfo: {},
    activeCount: 0,
  },
  bindTodoInput(e) {
    this.setData({
      todo: e.detail.value
    });
  },
  saveTodo(e) {
    const { todo, todos, filterTodos, filter, activeCount } = this.data;
    if (todo.trim().length === 0) return;

    const newTodo = {
      id: new Date().getTime(),
      todo: this.data.todo,
      completed: false,
    };
    todos.push(newTodo);
    if (filter !== 'completed') {
      filterTodos.push(newTodo);
    }
    this.setData({
      todo: '',
      todos,
      filterTodos,
      activeCount: activeCount + 1,
    });
  },
  todoFilter(filter, todos) {
    return filter === 'all' ? todos
      : todos.filter(x => x.completed === (filter !== 'active'));
  },
  toggleTodo(e) {
    const { todoId } = e.currentTarget.dataset;
    const { filter, activeCount } = this.data;
    let { todos } = this.data;
    let completed = false;
    todos = todos.map(todo => {
      if (Number(todoId) === todo.id) {
        todo.completed = !todo.completed;
        completed = todo.completed;
      }
      return todo;
    });
    const filterTodos = this.todoFilter(filter, todos);
    this.setData({
      todos,
      filterTodos,
      activeCount: completed ? activeCount - 1 : activeCount + 1,
    });
  },
  useFilter(e) {
    const { filter } = e.currentTarget.dataset;
    const { todos } = this.data;
    const filterTodos = this.todoFilter(filter, todos);
    this.setData({
      filter,
      filterTodos,
    });
  },
  clearCompleted() {
    const { filter } = this.data;
    let { todos } = this.data;
    todos = todos.filter(x => !x.completed);
    this.setData({
      todos,
      filterTodos: this.todoFilter(filter, todos),
    });
  },
  todoDel(e) {
    const { todoId } = e.currentTarget.dataset;
    const { filter, activeCount } = this.data;
    let { todos } = this.data;
    const todo = todos.find(x => Number(todoId) === x.id);
    todos = todos.filter(x => Number(todoId) !== x.id);
    this.setData({
      todos,
      filterTodos: this.todoFilter(filter, todos),
      activeCount: todo.completed ? activeCount : activeCount - 1,
    });
  },
  onLoad() {
    console.log('onLoad')
    var that = this
  	//调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo: userInfo
      });
      that.update();
    });
    wx.request({
      url: 'http://localhost:3000/todos',
      success: function(res) {
        const todos = res.data;
        const activeCount = todos
          .map(x => x.completed ? 0 : 1)
          .reduce((a, b) => a + b, 0);
        that.setData({
          todos,
          filterTodos: todos,
          activeCount,
        });
        that.update();
      }
    });
  }
})
