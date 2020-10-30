<template>
  <div class="container">
    <div class="select-reasons">
      <el-checkbox-group v-model="checkList">
        <el-checkbox-button
          v-for="user in usersOptions"
          :key="user.firstname"
          :label="user.firstname"
        />
      </el-checkbox-group>
    </div>

    <div class="select-reasons">
      <el-select v-model="reason" placeholder="MOTIFS">
        <el-option
          v-for="item in reasonsOptions"
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
        @click="generate(0)"
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
    checkList: [],

    usersOptions: [],
    reasonsOptions: [
      {
        value: 'travail',
        label: 'travail'
      },
      {
        value: 'achats',
        label: 'achats'
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
        value: 'handicap',
        label: 'handicap'
      },
      {
        value: 'sport_animaux',
        label: 'sport_animaux'
      },
      {
        value: 'convocation',
        label: 'convocation'
      },
      {
        value: 'enfants',
        label: 'enfants'
      }
    ],
    reason: null,
    value2: []
  }),
  computed: {
    selectedUsers() {
      return [
        {
          lastname: 'Malmasson',
          firstname: 'Fabien',
          birthday: '30/01/1984',
          placeofbirth: 'Fontenay-aux-roses',
          address: '66 rue de chateaulin',
          zipcode: '44000',
          city: 'Nantes'
        },
        {
          lastname: 'Autin',
          firstname: 'Sophie',
          birthday: '25/03/16',
          placeofbirth: 'Fontenay-le-comte',
          address: '66 rue de chateaulin',
          zipcode: '44000',
          city: 'Nantes'
        }
      ]
      // return this.usersOptions.filter((x) =>
      //   this.checkList.includes(x.firstname)
      // )
    },
    options() {
      return this.usersOptions
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    generate(v) {
      GeneratorService.generateAttest(this.selectedUsers, this.reason, v)
    },
    addPeople() {
      this.$router.push('form')
    },
    async getUsers() {
      const users = await this.$localForage.getItem('users')
      this.usersOptions = users
      // console.log(this.usersOptions)
      // if (this.usersOptions === null) this.addPeople()
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
  color: white;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
}

.el-input__inner::placeholder {
  color: white;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
}
.el-select-dropdown__item.selected {
  color: white;
}
.el-select-dropdown__item.selected {
  background-color: black;
}
.el-select-dropdown {
  border-color: white;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: black;
}
.el-select .el-input .el-input__inner {
  border-color: transparent;
}
.el-select-dropdown__list {
  background-color: white;
  border-color: white;
}
.el-input__inner {
  background-color: transparent;
  border-color: white;
  text-align: center;
  color: white;
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
  background-image: url('../static/881615.jpg');
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
  background-color: white;
  border-color: white;
  color: black;
}
.covid-btn-emergency {
  background-color: white;
  border-color: white;
  color: black;
}
</style>
