<template>
  <div class="toggle-switch" @click="toggle">
    <div class="switch" :class="{ active: value }"></div>
  </div>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style scoped>
.toggle-switch {
  width: 50px;
  height: 25px;
  background: #ccc;
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}
.switch {
  width: 23px;
  height: 23px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: left 0.3s;
}
.switch.active {
  left: 26px;
}
</style>
