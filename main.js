import Lucas from "./lucas"

const vm = new Lucas({
  el: '#app',
  data: {
    model: '',
    list: [
      { id: 1, content: 'one', red: true },
      { id: 2, content: 'two', red: false },
      { id: 3, content: 'three', red: false }
    ]
  },
  methods: {
    toggleRed(e, id) {
      this.list.find(item => item.id === id).red = !this.list.find(item => item.id === id).red;
    }
  },
})