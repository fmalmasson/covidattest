<template>
  <div class="container">
    <div>
      <el-select v-model="reasons" multiple placeholder="Motifs de sortie">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="links">
        <el-button class="covid-btn" type="primary" @click="generate"
          >Générer PDF</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import GeneratorService from '~/services/certificate.js'

export default {
  data: () => ({
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
    reasons: [],
    value2: []
  }),
  methods: {
    generate() {
      GeneratorService.generateAttest(this.reasons)
    }
  }
}
</script>

<style>
.covid-btn {
  background-color: #f8c702;
  border-color: #f8c702;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url('../static/quarantine.jpg');
  background-size: cover;
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
  padding-top: 15px;
}
</style>
