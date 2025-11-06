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
           :class="className" class="form-control"
           :id="ID"
           :type="type"
           :placeholder="placeholder"
    />
  </div>
</template>

<style scoped>

</style>