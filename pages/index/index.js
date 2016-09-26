//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    todo: '',
    todos: [],
    userInfo: {},
  },
  bindTodoInput: function(e) {
    this.setData({
      todo: e.detail.value
    });
  },
  saveTodo: function(e) {
    const { todo, todos } = this.data;
    if (todo && todo.trim().length === 0) return;
    if (e.keyCode !== 13) return;

    todos.push({
      id: new Date().getTime(),
      todo: this.data.todo,
      completed: false,
    });
    this.setData({
      todo: '',
      todos: todos,
    });
  },
  toggleTodo: function(e) {
    const { todoId } = e.currentTarget.dataset;
    const { todos } = this.data;
    for(let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      if (Number(todoId) === todo.id) {
        todo.completed = !todo.completed;
        todos[i] = todo;
        this.setData({
          todos: todos,
        });
        break;
      }
    }
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
        });
        that.update();
      }
    });
  }
})
