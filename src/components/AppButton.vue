<script>
export default {
  name: "AppButton",
  props: {
    type  : {type: String, required: false, default: 'button'},
    className : {type: String, required: false, default: ''},
  },
  emits: ['click']
}
</script>

<template>
  <button :type="type"
          :class="className"
          @click="$emit('click')"
          class="btn"
  >
    <slot/>
  </button>
</template>

<style scoped>

</style>