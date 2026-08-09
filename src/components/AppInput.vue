<script>
export default {
  name: "AppInput",
  props: {
    placeholder: {type: String, required: false,},
    type:        {type: String, required: false, default: 'text'},
    className:   {type: String, required: false},
    modelValue:  {type: String, required: false}
  },
  emits: ['update:modelValue'],
  computed: {
    ID() {
      return Math.random() + '.'  + Math.random()
    }
  }
}
</script>

<template>
  <div>
    <label :for="ID"><slot/></label>

    <input @input="$emit('update:modelValue', $event.target.value)"
           @keydown.enter="$emit('enter')"
           :class="className"
           :id="ID"
           :type="type"
           :placeholder="placeholder"
    />
  </div>
</template>

<style scoped>
input {
  width: 100%;
  outline: none;
}

input.search-input {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 1rem 1.5rem;
  color: #fff;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

input.search-input:focus {
  border-color: rgba(220, 53, 69, 0.5);
  box-shadow: 0 0 30px rgba(220, 53, 69, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

input.search-input::placeholder {
  color: #adb5bd;
}

input.text-center {
  text-align: center;
}
</style>
