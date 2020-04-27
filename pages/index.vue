<template>
  <div class="container">
    <div class="select-reasons">
      <el-select v-model="reason" placeholder="MOTIFS">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="links">
      <el-button
        round
        class="covid-btn-download"
        icon="el-icon-download"
        @click="generate"
      />
      <el-button
        class="covid-btn-emergency"
        icon="el-icon-timer"
        round
        @click="generate(20)"
      />
    </div>
  </div>
</template>

<script>
import GeneratorService from '~/services/certificate.js'

export default {
  data: () => ({
    users: [],
    usersOptions: [
      {
        lastname: 'Malmasson',
        firstname: 'Fabien',
        birthday: '30/01/1984',
        lieunaissance: 'Fontenay-aux-roses',
        address: '66 rue de chateaulin',
        zipcode: '44000',
        town: 'Nantes'
      },
      {
        lastname: 'Autin',
        firstname: 'Sophie',
        birthday: '25/03/1987',
        lieunaissance: 'Fontenay-le-comte',
        address: '66 rue de chateaulin',
        zipcode: '44000',
        town: 'Nantes'
      }
    ],
    options: [
      {
        value: 'travail',
        label: 'travail'
      },
      {
        value: 'courses',
        label: 'courses'
      },
      {
        value: 'sante',
        label: 'sante'
      },
      {
        value: 'famille',
        label: 'famille'
      },
      {
        value: 'sport',
        label: 'sport'
      },
      {
        value: 'judiciaire',
        label: 'judiciaire'
      },
      {
        value: 'missions',
        label: 'missions'
      }
    ],
    reason: null,
    value2: []
  }),
  methods: {
    generate(v) {
      if (v) {
        GeneratorService.generateAttest(this.usersOptions, this.reason, v)
      } else {
        GeneratorService.generateAttest(this.usersOptions, this.reason)
      }
    }
  }
}
</script>

<style>
li {
  font-weight: 400;
  font-family: 'Orbitron', sans-serif;
}
.el-input__inner {
  color: #ffdc32;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
}

.el-input__inner::placeholder {
  color: #ffdc32;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
}
.el-select-dropdown__item.selected {
  color: #ffdc32;
}
.el-select-dropdown__item.selected {
  background-color: black;
}
.el-select-dropdown {
  border-color: #ffdc32;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: black;
}
.el-select .el-input .el-input__inner {
  border-color: black;
}
.el-select-dropdown__list {
  background-color: #ffdc32;
  border-color: #ffdc32;
}
.el-input__inner {
  background-color: black;
  border-color: #ffdc32;
  text-align: center;
  color: #ffdc32;
}
.el-input__suffix {
  display: none;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-image: url('../static/319806.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: contain;
  background-color: black;
}
.select-reasons {
  margin-top: 20px;
  height: 80%;
  display: flex;
  align-items: flex-end;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  height: 20%;
  padding-top: 15px;
  margin-bottom: 20px;
}
.covid-btn-download {
  background-color: #ffdc32;
  border-color: #ffdc32;
  color: black;
}
.covid-btn-emergency {
  background-color: black;
  border-color: #ffdc32;
  color: #ffdc32;
}
</style>
