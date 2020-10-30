<template>
  <div class="form-container">
    <div class="form-container-inputs">
      <el-input v-model="user.lastname" placeholder="Nom"></el-input>
      <el-input v-model="user.firstname" placeholder="Prénom"></el-input>
      <el-input
        v-model="user.birthday"
        placeholder="Date de naissance (jj/mm/aaaa)"
      ></el-input>
      <el-input
        v-model="user.lieunaissance"
        placeholder="Lieu de naissance"
      ></el-input>
      <el-input v-model="user.address" placeholder="Adresse"></el-input>
      <el-input v-model="user.zipcode" placeholder="Code postal"></el-input>
      <el-input v-model="user.town" placeholder="Ville"></el-input>
    </div>
    <div class="form-actions">
      <el-button
        class="covid-btn-emergency"
        icon="el-icon-timer"
        round
        @click="addToLocalstorage"
      />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: {
      lastname: '',
      firstname: '',
      birthday: '',
      lieunaissance: '',
      address: '',
      zipcode: '',
      town: ''
    }
  }),
  methods: {
    async addToLocalstorage() {
      let users = await this.$localForage.getItem('users')
      if (users === null) {
        users = []
      }
      users[this.user.firstname] = this.user
      await this.$localForage.setItem('users', users)
      this.$router.push('/')
    }
  }
}
</script>
<style>
.form-container {
  height: 100vh;
  width: 100vw;
  background-image: url('../static/881615.jpg');
}
.el-input {
  margin-bottom: 10px;
}
</style>
