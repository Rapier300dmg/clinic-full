
<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <slot></slot>
        <button @click="close" class="close-btn">Закрыть</button>
      </div>
    </div>
  </template>
  
  <script>
/* eslint-disable vue/multi-word-component-names */
  export default {
    name: 'Modal',
    methods: {
      close() {
        this.$emit('close')
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: #fff;
    padding: 1.5rem;
    border-radius: 10px;
    max-width: 500px;
    width: 100%;
    text-align: center;
  }
  .close-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    border: none;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  