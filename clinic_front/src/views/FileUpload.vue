<template>
    <div class="file-upload">
      <h3>Загрузить файл к приёму</h3>
  
      <div class="form-group">
        <label for="appointment-id">ID приёма</label>
        <input
          id="appointment-id"
          v-model="appointmentId"
          type="text"
          placeholder="65f4a1b2c3d4e5f67890abcd"
          required
        />
      </div>
  
      <div class="form-group">
        <label for="file-name">Название файла</label>
        <input
          id="file-name"
          v-model="name"
          type="text"
          placeholder="Медицинский отчёт"
          required
        />
      </div>
  
      <div class="form-group">
        <label class="upload-label">
          Выбрать файл
          <input type="file" @change="onFileChange" required />
        </label>
      </div>
  
      <button
        class="btn-submit"
        :disabled="!canUpload"
        @click="uploadFile"
      >
        Загрузить
      </button>
  
      <p v-if="message" :class="{ success, error: !success }">
        {{ message }}
      </p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'FileUpload',
    data() {
      return {
        appointmentId: '',
        name: '',
        file: null,
        message: '',
        success: false
      }
    },
    computed: {
      canUpload() {
        return this.appointmentId && this.name && this.file
      }
    },
    methods: {
      onFileChange(event) {
        this.file = event.target.files[0]
      },
      async uploadFile() {
        this.message = ''
        this.success = false
  
        try {
          const token = localStorage.getItem('token')
          const formData = new FormData()
          formData.append('file-doc', this.file)
          formData.append('name', this.name)
          formData.append('appointmentId', this.appointmentId)
  
          const res = await axios.post(
            `${process.env.VUE_APP_API_URL}/files`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          )
  
          this.message = 'Файл успешно загружен'
          this.success = true
          this.appointmentId = ''
          this.name = ''
          this.file = null
          this.$refs.fileInput.value = null
        } catch (err) {
          console.error('Ошибка при загрузке файла:', err)
          this.message =
            err.response?.data?.message || 'Не удалось загрузить файл'
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .file-upload {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  
  .file-upload h3 {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  
  .form-group input[type="text"],
  .form-group input[type="file"] {
    width: 100%;
  }
  
  .upload-label {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #007bff;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .upload-label input {
    display: none;
  }
  
  .btn-submit {
    display: block;
    width: 100%;
    padding: 0.6rem;
    background: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .btn-submit:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .success {
    margin-top: 1rem;
    color: #28a745;
    text-align: center;
  }
  
  .error {
    margin-top: 1rem;
    color: #dc3545;
    text-align: center;
  }
  </style>
  