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
  },
  bindTodoInput: function(e) {
    this.setData({
      todo: e.detail.value
    });
  },
  saveTodo: function(e) {
    const { todo, todos, filterTodos, filter } = this.data;
    if (todo && todo.trim().length === 0) return;
    if (e.keyCode !== 13) return;

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
    });
  },
  todoFilter: function(filter, todos) {
    return filter === 'all' ? todos
      : todos.filter(x => x.completed === (filter !== 'active'));
  },
  toggleTodo: function(e) {
    const { todoId } = e.currentTarget.dataset;
    const { filter } = this.data;
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
    });
  },
  useFilter: function(e) {
    const { filter } = e.currentTarget.dataset;
    const { todos } = this.data;
    const filterTodos = this.todoFilter(filter, todos);
    this.setData({
      filter,
      filterTodos,
    });
  },
  onLoad: function () {
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
        that.setData({
          todos: res.data,
          filterTodos: res.data,
        });
        that.update();
      }
    });
  }
})
